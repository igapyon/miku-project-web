---
title: miku-project runtime intake
status: active
updated: 2026-08-09
---

# Runtime intake

[runtime lock](../runtime/miku-project-runtime.lock.json) は次を一体として固定する。

- `release_tag`
- `package_version`
- `asset_name`
- `sha256`

`npm run runtime:fetch` は cache、`MIKU_PROJECT_RUNTIME_FILE`、固定 GitHub Release URL の順で runtime 候補を得る。どの経路でも lock schema、tag/version、asset 契約、runtime の version export、SHA-256 を検証する。

lock 更新時は `miku-project` Release に添付された `miku-project-runtime-<version>.json` の内容をそのまま反映し、`npm run verify` を行う。runtime file 自体は Git 管理しない。

## Bootstrap order

single-file builder は次の順序を一つの inline module に固定する。

1. 検証済み runtime source
2. `loadMikuProjectRuntime({ expectedVersion })`
3. Web-owned `main-*` modules
4. runtime provenance を示す `globalThis.__mikuProjectWebRuntime`

この順序が崩れた場合は build/test を失敗させる。
