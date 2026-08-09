---
title: miku-project-web specification
status: active
updated: 2026-08-09
---

# Web App specification

機能仕様は upstream [`miku-project` documentation](https://github.com/igapyon/miku-project/tree/devel/docs) を参照する。この repository は機能意味論を変更せず、browser UI と配布境界を所有する。

Web 固有の必須条件は次のとおり。

- lock と一致する runtime だけを build 入力にする
- runtime loader 完了後に UI を初期化する
- single-file `miku-project.html` に runtime、UI、CSS、component assets を内包する
- browser 実行時に runtime や UI asset の追加 network request を発生させない
- Input、Overview、Output、主要 import/export を browser/UI test で維持する
