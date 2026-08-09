import fs from "node:fs";
import path from "node:path";
import {
  readRuntimeLock,
  runtimeCachePath,
  runtimeDownloadUrl,
  verifyRuntimeBytes
} from "./lib/runtime-lock.mjs";

const ROOT = process.cwd();
const lock = readRuntimeLock(ROOT);
const cachePath = runtimeCachePath(ROOT, lock);
const localRuntimePath = process.env.MIKU_PROJECT_RUNTIME_FILE;

let bytes;
let sourceLabel;

if (localRuntimePath) {
  const resolvedLocalPath = path.resolve(localRuntimePath);
  bytes = fs.readFileSync(resolvedLocalPath);
  sourceLabel = resolvedLocalPath;
} else if (fs.existsSync(cachePath)) {
  const cachedBytes = fs.readFileSync(cachePath);
  try {
    verifyRuntimeBytes(cachedBytes, lock);
    bytes = cachedBytes;
    sourceLabel = cachePath;
  } catch (_error) {
    fs.rmSync(cachePath, { force: true });
  }
}

if (!bytes) {
  const url = runtimeDownloadUrl(lock);
  const response = await fetch(url, {
    headers: { "user-agent": "miku-project-web-runtime-fetch" },
    redirect: "follow"
  });
  if (!response.ok) {
    throw new Error(`miku-project runtime download failed: ${response.status} ${response.statusText} (${url})`);
  }
  bytes = Buffer.from(await response.arrayBuffer());
  sourceLabel = url;
}

verifyRuntimeBytes(bytes, lock);
fs.mkdirSync(path.dirname(cachePath), { recursive: true });
const temporaryPath = `${cachePath}.tmp-${process.pid}`;
fs.writeFileSync(temporaryPath, bytes);
fs.renameSync(temporaryPath, cachePath);

console.log(`[runtime:fetch] verified ${lock.release_tag} ${lock.asset_name}`);
console.log(`[runtime:fetch] source ${sourceLabel}`);
