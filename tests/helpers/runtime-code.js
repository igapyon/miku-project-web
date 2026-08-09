import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { toClassicRuntimeSource } from "../../scripts/lib/runtime-embed.mjs";
import {
  readRuntimeLock,
  runtimeCachePath,
  verifyRuntimeBytes
} from "../../scripts/lib/runtime-lock.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const lock = readRuntimeLock(ROOT);
const runtimeBytes = fs.readFileSync(runtimeCachePath(ROOT, lock));

verifyRuntimeBytes(runtimeBytes, lock);

export const runtimeCode = toClassicRuntimeSource(
  runtimeBytes.toString("utf8"),
  lock.package_version
);
