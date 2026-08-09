---
title: miku-project-web verification record
status: active
updated: 2026-08-09
---

# Verification record

## Verified locally

Pinned runtime:

- release tag: `v0.13.0`
- asset: `miku-project-runtime-0.13.0.mjs`
- SHA-256: `b4f19e38ad53284d001180df1ded15fb794fa1fb56d0e7722b144ebec8b5a65d`

`MIKU_PROJECT_RUNTIME_FILE` に上記 SHA-256 の locally built Release candidate を指定し、通常 checkout と `.cache` / `node_modules` を持たない clean copy の両方で次が成功した。

- `npm ci`: 89 packages、audit 0 vulnerabilities
- `npm run verify`: 18 test files、135 tests
- single-file build: 23 Web-owned modules と検証済み runtime を内包
- offline smoke: Input / Overview / Output、15 output entries
- request-generating runtime / script / stylesheet / media asset reference: なし
- `src/js/`: Web-owned 23 files のみ

Main Application 側では browser runtime、CLI bundle の再生成と、27 test files / 314 tests が成功した。

## Release gate

次は upstream `miku-project` の `v0.13.0` Release 公開後に確認する。

- clean clone から local override なしで固定 GitHub Release asset を取得できる
- GitHub Actions CI が成功する
- generated `miku-project.html` を実ブラウザで起動し、主要 UI / import / export を smoke できる

この gate が閉じるまで、Main Application repository の Web-only source は削除しない。
