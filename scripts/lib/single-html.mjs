import fs from "node:fs";
import path from "node:path";

import { buildEmbeddedApplicationModule } from "./runtime-embed.mjs";
import {
  readRuntimeLock,
  runtimeCachePath,
  verifyRuntimeBytes
} from "./runtime-lock.mjs";

function getAttr(tagText, attrName) {
  const escaped = attrName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const attrRegex = new RegExp(`${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, "i");
  const match = tagText.match(attrRegex);
  if (!match) return "";
  return match[1] ?? match[2] ?? match[3] ?? "";
}

function isLocalAssetRef(ref) {
  if (!ref) return false;
  return !/^(?:[a-z]+:)?\/\//i.test(ref) && !/^data:/i.test(ref) && !ref.startsWith("#");
}

function escapeScriptForInlineHtml(scriptText) {
  return scriptText.replace(/<\/script/gi, "<\\/script");
}

function injectBeforeLastClosingTag(html, tagName, injectText) {
  const closeTag = `</${tagName.toLowerCase()}>`;
  const lowerHtml = html.toLowerCase();
  const index = lowerHtml.lastIndexOf(closeTag);
  if (index < 0) return html;
  return html.slice(0, index) + injectText + html.slice(index);
}

export function buildSingleHtmlFromSource(sourceHtml, srcHtmlPath, options = {}) {
  const srcDir = path.dirname(srcHtmlPath);
  const rootDirectory = options.rootDirectory || srcDir;
  const cssBlocks = [];
  const supportScriptBlocks = [];
  const webModuleBlocks = [];
  let runtimeMarkerCount = 0;
  let output = sourceHtml;

  output = output.replace(/<link\b[^>]*>/gi, (tag) => {
    const rel = getAttr(tag, "rel").toLowerCase();
    if (rel !== "stylesheet") return tag;
    const href = getAttr(tag, "href");
    if (!isLocalAssetRef(href)) return tag;
    const assetPath = path.resolve(srcDir, href);
    cssBlocks.push(fs.readFileSync(assetPath, "utf8").trimEnd());
    return "";
  });

  output = output.replace(/<script\b([^>]*)data-miku-project-runtime([^>]*)>\s*<\/script>/gi, () => {
    runtimeMarkerCount += 1;
    return "";
  });

  output = output.replace(/<script\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*>\s*<\/script>/gi, (full, _quote, src) => {
    if (!isLocalAssetRef(src)) return full;
    const assetPath = path.resolve(srcDir, src);
    const scriptText = fs.readFileSync(assetPath, "utf8").trimEnd();
    const block = `// embedded Web asset: ${src}\n${scriptText}`;
    if (src.startsWith("src/js/")) {
      webModuleBlocks.push(block);
    } else {
      supportScriptBlocks.push(block);
    }
    return "";
  });

  output = output.replace(/^[ \t]+(?=\r?$)/gm, "");
  output = output.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    if (/\bsrc\s*=/.test(attrs)) return full;
    return `<script${attrs}>${escapeScriptForInlineHtml(body)}</script>`;
  });

  if (cssBlocks.length > 0) {
    output = injectBeforeLastClosingTag(
      output,
      "head",
      `  <style>\n${cssBlocks.join("\n\n")}\n  </style>\n`
    );
  }

  const trailingScripts = [];
  for (const scriptText of supportScriptBlocks) {
    trailingScripts.push(`  <script>\n${escapeScriptForInlineHtml(scriptText)}\n  </script>`);
  }

  if (runtimeMarkerCount > 0 || webModuleBlocks.length > 0) {
    if (runtimeMarkerCount !== 1) {
      throw new Error(`miku-project Web source must contain exactly one runtime marker; actual ${runtimeMarkerCount}`);
    }
    const lock = readRuntimeLock(rootDirectory);
    const cachedRuntimePath = runtimeCachePath(rootDirectory, lock);
    const runtimeBytes = fs.readFileSync(cachedRuntimePath);
    verifyRuntimeBytes(runtimeBytes, lock);
    const appModule = buildEmbeddedApplicationModule(
      runtimeBytes.toString("utf8"),
      lock,
      webModuleBlocks
    );
    trailingScripts.push(`  <script type="module">\n${escapeScriptForInlineHtml(appModule)}\n  </script>`);
  }

  if (trailingScripts.length > 0) {
    output = injectBeforeLastClosingTag(output, "body", `${trailingScripts.join("\n\n")}\n`);
  }

  return output.replace(/^[ \t]+$/gm, "");
}
