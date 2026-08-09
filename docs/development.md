---
title: miku-project-web development
status: active
updated: 2026-08-09
---

# Development

## Commands

```bash
npm run runtime:fetch
npm run build:js
npm run build:html
npm run build
npm test
npm run test:offline
npm run verify
```

- `runtime:fetch`: upstream runtime を取得・検証して `.cache/runtime/` に保存する
- `build:js`: Web-owned TypeScript を `src/js/` へ生成する
- `build:html`: `index.html` と runtime 内包済み `miku-project.html` を生成する
- `test:offline`: single-file 内に request-generating asset reference がないことと、runtime/UI の起動を jsdom で smoke する

`src/js/`、`index.html`、`miku-project.html` は生成物として Git 管理する。手編集せず source と build scripts を更新する。

## Publication policy

Web Release は `miku-project.html`、`index.html`、`mikuproject.html` を独立した成果物として添付する。配布 HTML は browser 起動時に upstream runtime を取得しない。GitHub Pages を有効にする場合も同じ生成物を公開し、runtime を動的配信しない。
