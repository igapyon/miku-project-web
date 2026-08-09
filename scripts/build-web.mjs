import fs from "node:fs";
import path from "node:path";

import { buildSingleHtmlFromSource } from "./lib/single-html.mjs";
import { WEB_TYPESCRIPT_RELATIVE_PATHS } from "./lib/web-module-paths.mjs";

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
for (const arg of args) {
  if (arg !== "--js-only" && arg !== "--html-only") {
    throw new Error(`unsupported build argument: ${arg}`);
  }
}
const buildJs = !args.has("--html-only");
const buildHtml = !args.has("--js-only");

if (buildJs) {
  await transpileWebModules();
}
if (buildHtml) {
  buildHtmlTargets();
}

async function transpileWebModules() {
  const typescriptModule = await import("typescript");
  const ts = typescriptModule.default || typescriptModule;
  for (const relativeTsPath of WEB_TYPESCRIPT_RELATIVE_PATHS) {
    const sourcePath = path.resolve(ROOT, relativeTsPath);
    const outputPath = path.resolve(
      ROOT,
      relativeTsPath.replace("src/ts/", "src/js/").replace(/\.ts$/, ".js")
    );
    const source = fs.readFileSync(sourcePath, "utf8");
    const result = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2019,
        module: ts.ModuleKind.None,
        lib: ["ES2020", "DOM"],
        strict: false,
        skipLibCheck: true
      },
      reportDiagnostics: true,
      fileName: sourcePath
    });
    const errors = (result.diagnostics || [])
      .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    if (errors.length > 0) {
      throw new Error(`TypeScript transpile error in ${relativeTsPath}:\n${errors.join("\n")}`);
    }
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result.outputText, "utf8");
  }
  console.log(`[build:web] generated ${WEB_TYPESCRIPT_RELATIVE_PATHS.length} Web modules`);
}

function buildHtmlTargets() {
  for (const target of [
    { source: "index-src.html", output: "index.html" },
    { source: "miku-project-src.html", output: "miku-project.html" }
  ]) {
    const sourcePath = path.resolve(ROOT, target.source);
    const outputPath = path.resolve(ROOT, target.output);
    const source = applyTemplateValues(fs.readFileSync(sourcePath, "utf8"));
    const output = buildSingleHtmlFromSource(source, sourcePath, { rootDirectory: ROOT });
    fs.writeFileSync(outputPath, output, "utf8");
    console.log(`[build:web] generated ${target.output}`);
  }
}

function applyTemplateValues(source) {
  const now = new Date();
  const buildDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
  return source.replaceAll("{{BUILD_DATE}}", buildDate);
}
