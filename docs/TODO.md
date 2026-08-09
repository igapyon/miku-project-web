# TODO

この文書には、Web App 固有の未完了作業だけを書く。core API、CLI、browser runtime の backlog は `miku-project` 側で管理する。

## Web UI

- 再読込テストで validation error が見つかった場合の UI 表示について、status / toast / validation 詳細導線の最終仕様を整理する。
- `phase_detail_view scoped` の `phase UID / root UID / max depth` 指定を、より選びやすい UI に改善する。
- 既存 WBS の局所修正フローを CLI / Agent Skills 主導に寄せる方針に合わせて、Web UI の AI 連携欄を軽量化する。
  - `bundle` や `phase detail full` を前面導線から外すか。
  - `project overview` / `task edit` / `phase detail scoped` / `patch_json import` に絞るか。
  - UI は軽い入口と確認用に留める説明へ寄せるか。
- `project_draft_request` を UI から生成しやすくするか整理する。
- `Input / Overview / Output` の各カードの余白・見出し・ボタン階層を見直し、miku 系テーマの統一感をさらに整える。
