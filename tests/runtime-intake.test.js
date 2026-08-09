import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildEmbeddedApplicationModule } from "../scripts/lib/runtime-embed.mjs";
import {
  readRuntimeLock,
  runtimeCachePath,
  runtimeDownloadUrl,
  verifyRuntimeBytes
} from "../scripts/lib/runtime-lock.mjs";
import { WEB_MODULE_RELATIVE_PATHS } from "../scripts/lib/web-module-paths.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const lock = readRuntimeLock(ROOT);
const runtimePath = runtimeCachePath(ROOT, lock);
const runtimeBytes = fs.readFileSync(runtimePath);
const runtimeSource = runtimeBytes.toString("utf8");

describe("miku-project runtime intake", () => {
  it("pins an exact upstream Release tag, asset, version, and SHA-256", () => {
    expect(lock).toEqual({
      schema_version: "miku-project.browser-runtime-lock/v1",
      release_tag: "v0.13.0",
      package_version: "0.13.0",
      asset_name: "miku-project-runtime-0.13.0.mjs",
      sha256: "b4f19e38ad53284d001180df1ded15fb794fa1fb56d0e7722b144ebec8b5a65d"
    });
    expect(runtimeDownloadUrl(lock)).toBe(
      "https://github.com/igapyon/miku-project/releases/download/v0.13.0/miku-project-runtime-0.13.0.mjs"
    );
    expect(verifyRuntimeBytes(runtimeBytes, lock)).toBe(lock.sha256);
  });

  it("rejects a tampered runtime before build", () => {
    const tampered = Buffer.concat([runtimeBytes, Buffer.from("\n// tampered\n")]);
    expect(() => verifyRuntimeBytes(tampered, lock)).toThrow(/sha256 mismatch/);
  });

  it("boots the verified runtime before every Web module", () => {
    const webBlocks = WEB_MODULE_RELATIVE_PATHS.map((relativePath) =>
      `// ${relativePath}\nglobalThis.__webOrder = [...(globalThis.__webOrder || []), ${JSON.stringify(relativePath)}];`
    );
    const applicationModule = buildEmbeddedApplicationModule(runtimeSource, lock, webBlocks);
    const bootstrapIndex = applicationModule.indexOf("// miku-project-web runtime bootstrap");
    expect(bootstrapIndex).toBeGreaterThan(0);
    expect(applicationModule.indexOf("loadMikuProjectRuntime({ expectedVersion", bootstrapIndex)).toBeGreaterThan(bootstrapIndex);
    for (const relativePath of WEB_MODULE_RELATIVE_PATHS) {
      expect(applicationModule.indexOf(`// ${relativePath}`)).toBeGreaterThan(bootstrapIndex);
    }
  });

  it("keeps core source out of the Web-owned module list", () => {
    const actualSourcePaths = fs.readdirSync(path.resolve(ROOT, "src/js"))
      .filter((fileName) => fileName.endsWith(".js"))
      .map((fileName) => `src/js/${fileName}`)
      .sort();
    const expectedSourcePaths = [...WEB_MODULE_RELATIVE_PATHS].sort();

    expect(WEB_MODULE_RELATIVE_PATHS).toHaveLength(23);
    expect(WEB_MODULE_RELATIVE_PATHS.every((relativePath) => /\/main(?:-|\.js)/.test(relativePath))).toBe(true);
    expect(WEB_MODULE_RELATIVE_PATHS).not.toContain("src/js/main-util.js");
    expect(WEB_MODULE_RELATIVE_PATHS).not.toContain("src/js/core-api.js");
    expect(actualSourcePaths).toEqual(expectedSourcePaths);
  });
});
