import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const RUNTIME_LOCK_SCHEMA = "miku-project.browser-runtime-lock/v1";

export function readRuntimeLock(rootDirectory) {
  const lockPath = path.resolve(rootDirectory, "runtime/miku-project-runtime.lock.json");
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  validateRuntimeLock(lock);
  return Object.freeze({ ...lock });
}

export function validateRuntimeLock(lock) {
  if (!lock || typeof lock !== "object" || Array.isArray(lock)) {
    throw new TypeError("miku-project runtime lock must be an object");
  }
  if (lock.schema_version !== RUNTIME_LOCK_SCHEMA) {
    throw new Error(`unsupported miku-project runtime lock schema: ${lock.schema_version}`);
  }
  for (const key of ["release_tag", "package_version", "asset_name", "sha256"]) {
    if (typeof lock[key] !== "string" || lock[key].length === 0) {
      throw new Error(`miku-project runtime lock ${key} must be a non-empty string`);
    }
  }
  if (!lock.release_tag.startsWith("v")) {
    throw new Error(`miku-project runtime release tag must start with v: ${lock.release_tag}`);
  }
  const releaseVersion = lock.release_tag.slice(1);
  if (
    releaseVersion !== lock.package_version &&
    !releaseVersion.startsWith(`${lock.package_version}.`)
  ) {
    throw new Error(
      `miku-project runtime release ${releaseVersion} does not match package ${lock.package_version}`
    );
  }
  const expectedAssetName = `miku-project-runtime-${releaseVersion}.mjs`;
  if (lock.asset_name !== expectedAssetName) {
    throw new Error(
      `miku-project runtime asset mismatch: expected ${expectedAssetName}, actual ${lock.asset_name}`
    );
  }
  if (!/^[0-9a-f]{64}$/.test(lock.sha256)) {
    throw new Error("miku-project runtime sha256 must be 64 lowercase hexadecimal characters");
  }
}

export function runtimeDownloadUrl(lock) {
  validateRuntimeLock(lock);
  return `https://github.com/igapyon/miku-project/releases/download/${encodeURIComponent(lock.release_tag)}/${encodeURIComponent(lock.asset_name)}`;
}

export function runtimeCachePath(rootDirectory, lock) {
  validateRuntimeLock(lock);
  return path.resolve(rootDirectory, ".cache/runtime", lock.asset_name);
}

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function verifyRuntimeBytes(bytes, lock) {
  validateRuntimeLock(lock);
  const actualSha256 = sha256(bytes);
  if (actualSha256 !== lock.sha256) {
    throw new Error(
      `miku-project runtime sha256 mismatch: expected ${lock.sha256}, actual ${actualSha256}`
    );
  }
  const source = Buffer.from(bytes).toString("utf8");
  const versionMatch = source.match(/^export const version = ("(?:[^"\\]|\\.)*");$/m);
  if (!versionMatch || JSON.parse(versionMatch[1]) !== lock.package_version) {
    throw new Error(`miku-project runtime version export does not match ${lock.package_version}`);
  }
  if (!source.includes("export function loadMikuProjectRuntime(options = {})")) {
    throw new Error("miku-project runtime loader export is missing");
  }
  return actualSha256;
}
