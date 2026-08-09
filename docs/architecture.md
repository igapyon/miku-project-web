---
title: miku-project-web architecture
status: active
updated: 2026-08-09
---

# Architecture

`miku-project-web` は Web surface のみを所有し、core 実装を source tree に複製しない。

```text
miku-project Release
  runtime tag + asset + SHA-256 manifest
                 |
                 v build-time fetch and verification
runtime/miku-project-runtime.lock.json
                 |
                 v loadMikuProjectRuntime({ expectedVersion })
src/ts/main-*.ts + src/ts/main.ts + HTML/CSS/lht-cmn
                 |
                 v single-file build
           miku-project.html
```

runtime loader は Web module より先に実行する。生成 HTML には runtime と UI を同じ inline module として格納し、browser 実行時の runtime download を禁止する。

`src/js/` の Web module は `src/ts/` から生成して Git 管理する。browser/UI tests も個別 core source を参照せず、repository-local lock で検証した runtime を test helper から直接起動する。
