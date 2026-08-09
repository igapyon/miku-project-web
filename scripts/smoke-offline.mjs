import fs from "node:fs";
import path from "node:path";

import { JSDOM } from "jsdom";

import { toClassicModuleSource } from "./lib/runtime-embed.mjs";
import { readRuntimeLock } from "./lib/runtime-lock.mjs";

const ROOT = process.cwd();
const htmlPath = path.resolve(ROOT, process.argv[2] || "miku-project.html");
const html = fs.readFileSync(htmlPath, "utf8");
const lock = readRuntimeLock(ROOT);

assertNoRequestGeneratingAssets(html);

const scriptBlocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((match) => ({
  attrs: match[1],
  source: match[2].replaceAll("<\\/script", "</script")
}));

if (scriptBlocks.length < 2) {
  throw new Error("offline Web App must contain component scripts and one application module");
}
if (scriptBlocks.filter((block) => /\btype=["']module["']/i.test(block.attrs)).length !== 1) {
  throw new Error("offline Web App must contain exactly one application module");
}

const dom = new JSDOM(html, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  url: "https://offline.invalid/miku-project.html"
});
const { window } = dom;

for (const name of [
  "TextEncoder",
  "TextDecoder",
  "CompressionStream",
  "DecompressionStream",
  "Blob",
  "File",
  "ReadableStream",
  "WritableStream"
]) {
  if (globalThis[name] && !window[name]) {
    window[name] = globalThis[name];
  }
}
window.URL.createObjectURL = () => "blob:offline-smoke";
window.URL.revokeObjectURL = () => {};
window.matchMedia = window.matchMedia || ((media) => ({
  matches: false,
  media,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() { return false; }
}));

for (const tagName of [
  "md-icon-button",
  "md-filled-button",
  "md-switch",
  "md-outlined-text-field",
  "md-outlined-select",
  "md-select-option"
]) {
  if (!window.customElements.get(tagName)) {
    window.customElements.define(tagName, class extends window.HTMLElement {});
  }
}

for (const block of scriptBlocks) {
  if (block.source.includes("embedded Web asset: lht-cmn/vendor/")) {
    continue;
  }
  const source = /\btype=["']module["']/i.test(block.attrs)
    ? toClassicModuleSource(block.source)
    : block.source;
  window.eval(source);
}

window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
await new Promise((resolve) => window.setTimeout(resolve, 0));

if (!window.__mikuProjectCoreApi) {
  throw new Error("offline Web App did not initialize __mikuProjectCoreApi");
}
if (window.__mikuProjectWebRuntime?.version !== lock.package_version) {
  throw new Error("offline Web App runtime provenance is missing or mismatched");
}
if (!window.__mikuprojectMainTestHooks) {
  throw new Error("offline Web App did not initialize its UI hooks");
}
for (const elementId of ["tabPanelInput", "tabPanelTransform", "tabPanelOutput", "xmlInput"]) {
  if (!window.document.getElementById(elementId)) {
    throw new Error(`offline Web App is missing #${elementId}`);
  }
}
if (!window.document.getElementById("xmlInput").value.includes("<Project")) {
  throw new Error("offline Web App did not load its sample project through the input flow");
}
const outputEntries = window.__mikuprojectMainTestHooks.buildCurrentOutputArchiveEntries();
if (!Array.isArray(outputEntries) || outputEntries.length < 5) {
  throw new Error("offline Web App did not produce its main output set");
}

console.log(
  `[smoke:offline] ok ${lock.release_tag} input/overview/output ${outputEntries.length} outputs, no runtime network request`
);

function assertNoRequestGeneratingAssets(source) {
  const forbidden = [
    /<script\b[^>]*\bsrc\s*=/i,
    /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref\s*=/i,
    /<link\b[^>]*\bhref\s*=.*\brel=["']stylesheet["']/i,
    /<(?:img|iframe|source|audio|video)\b[^>]*\bsrc\s*=/i,
    /@import\s+/i,
    /url\(\s*["']?(?:https?:)?\/\//i
  ];
  for (const pattern of forbidden) {
    if (pattern.test(source)) {
      throw new Error(`offline Web App contains a request-generating asset reference: ${pattern}`);
    }
  }
}
