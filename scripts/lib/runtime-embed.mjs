export function toClassicRuntimeSource(runtimeSource, expectedVersion) {
  assertRuntimeSource(runtimeSource, expectedVersion);
  const classicSource = toClassicModuleSource(runtimeSource);

  return [
    classicSource.trimEnd(),
    "delete globalThis.__mikuProjectCoreApi;",
    "delete globalThis.__mikuprojectCoreApi;",
    `loadMikuProjectRuntime({ expectedVersion: ${JSON.stringify(expectedVersion)} });`,
    ""
  ].join("\n");
}

export function toClassicModuleSource(moduleSource) {
  return moduleSource
    .replace(/^export const /gm, "const ")
    .replace(/^export function /gm, "function ")
    .replace(/^export default loadMikuProjectRuntime;\s*$/m, "");
}

export function buildEmbeddedApplicationModule(runtimeSource, lock, webModuleBlocks) {
  assertRuntimeSource(runtimeSource, lock.package_version);
  if (!Array.isArray(webModuleBlocks) || webModuleBlocks.length === 0) {
    throw new Error("miku-project Web application module list is empty");
  }
  return [
    runtimeSource.trimEnd(),
    "",
    "// miku-project-web runtime bootstrap: core must be ready before Web modules.",
    `const __mikuProjectWebCoreApi = loadMikuProjectRuntime({ expectedVersion: ${JSON.stringify(lock.package_version)} });`,
    "if (__mikuProjectWebCoreApi !== globalThis.__mikuProjectCoreApi) {",
    "  throw new Error(\"miku-project Web runtime bootstrap did not install the canonical core API\");",
    "}",
    "",
    ...webModuleBlocks,
    "",
    "globalThis.__mikuProjectWebRuntime = Object.freeze({",
    `  version: ${JSON.stringify(lock.package_version)},`,
    `  releaseTag: ${JSON.stringify(lock.release_tag)},`,
    `  assetName: ${JSON.stringify(lock.asset_name)},`,
    `  sha256: ${JSON.stringify(lock.sha256)}`,
    "});",
    "document.documentElement.dataset.mikuProjectRuntimeVersion = globalThis.__mikuProjectWebRuntime.version;",
    ""
  ].join("\n");
}

function assertRuntimeSource(runtimeSource, expectedVersion) {
  if (typeof runtimeSource !== "string" || runtimeSource.length === 0) {
    throw new Error("miku-project runtime source is empty");
  }
  if (!runtimeSource.includes(`export const version = ${JSON.stringify(expectedVersion)};`)) {
    throw new Error(`miku-project runtime source does not export version ${expectedVersion}`);
  }
  if (!runtimeSource.includes("export function loadMikuProjectRuntime(options = {})")) {
    throw new Error("miku-project runtime source does not export its loader");
  }
}
