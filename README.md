# マーダーミステリー作成支援プラットフォーム

マーダーミステリーゲームの制作を支援するWebアプリケーションです。シナリオの作成、キャラクター管理、タイムライン編集、手がかりカード管理、PDF出力など、マーダーミステリー制作に必要なすべての機能を備えています。

## 技術スタック

- **フロントエンド:** Astro 5 + React 19 + TailwindCSS 4
- **バックエンド:** Cloudflare Workers
- **データベース:** Cloudflare D1 (SQLite)
- **デプロイ:** Cloudflare Pages

## 主な機能

### 1. シナリオ管理
- 複数のシナリオを作成・編集・削除
- シナリオのタイトルと説明を管理

### 2. キャラクター管理
- シナリオごとにキャラクターを追加
- 役割、背景ストーリー、目的・秘密を記録
- キャラクターの詳細情報を編集

### 3. タイムライン編集
- 事件の時系列を管理
- イベントの時刻と説明を記録
- 時系列順に自動ソート

### 4. カード管理
- 手がかり、アイテム、情報、秘密、証拠などのカードを作成
- カードをキャラクターに割り当て
- カードタイプ別にフィルタリング

### 5. PDF出力
- **メインストーリー:** シナリオ概要、タイムライン、登場人物をまとめたPDF
- **キャラクターシート:** 各キャラクターの詳細情報を個別PDFで出力
- **カード:** 印刷用レイアウトでカードをPDF出力

## セットアップ

### 前提条件
- Node.js 22.13.0以上
- pnpm 10.29.2以上
- Cloudflareアカウント

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/osushizm/mystery.git
cd mystery

# 依存パッケージをインストール
pnpm install
```

### ローカル開発

```bash
# 開発サーバーを起動
pnpm dev

# ブラウザで http://localhost:3000 にアクセス
```

### データベースマイグレーション

```bash
# ローカルデータベースにマイグレーション適用
wrangler d1 migrations apply DB --local

# 本番環境に適用（デプロイ後）
wrangler d1 migrations apply personal-site-db --remote
```

## プロジェクト構成

```
mystery/
├── src/
│   ├── components/
│   │   ├── murder-mystery/
│   │   │   ├── Dashboard.tsx           # ダッシュボード
│   │   │   ├── ScenarioEditor.tsx      # シナリオ・キャラクター編集
│   │   │   ├── TimelineEditor.tsx      # タイムライン編集
│   │   │   ├── CardManager.tsx         # カード管理
│   │   │   └── PDFExporter.tsx         # PDF出力
│   │   └── layout/                     # レイアウトコンポーネント
│   ├── pages/
│   │   └── mystery/
│   │       ├── index.astro             # ダッシュボード
│   │       └── scenario/
│   │           └── [scenarioId].astro  # シナリオ詳細
│   └── utils/
│       ├── api.ts                      # API呼び出し関数
│       └── pdf-export.ts               # PDF生成ユーティリティ
├── functions/
│   ├── api/
│   │   ├── scenarios.ts                # シナリオAPI
│   │   ├── characters.ts               # キャラクターAPI
│   │   ├── timelines.ts                # タイムラインAPI
│   │   └── cards.ts                    # カードAPI
│   └── _middleware.ts                  # ルーティング・CORS設定
├── migrations/
│   ├── 0001_initial.sql
│   └── 0002_create_murder_mystery_tables.sql
├── astro.config.mjs
├── wrangler.toml
└── package.json
```

## API エンドポイント

### シナリオ
- `GET /api/scenarios` - シナリオ一覧
- `GET /api/scenarios/:id` - シナリオ詳細
- `POST /api/scenarios` - シナリオ作成
- `PUT /api/scenarios/:id` - シナリオ更新
- `DELETE /api/scenarios/:id` - シナリオ削除

### キャラクター
- `GET /api/scenarios/:scenarioId/characters` - キャラクター一覧
- `POST /api/scenarios/:scenarioId/characters` - キャラクター作成
- `PUT /api/scenarios/:scenarioId/characters/:characterId` - キャラクター更新
- `DELETE /api/scenarios/:scenarioId/characters/:characterId` - キャラクター削除

### タイムライン
- `GET /api/scenarios/:scenarioId/timelines` - タイムライン一覧
- `POST /api/scenarios/:scenarioId/timelines` - タイムライン作成
- `PUT /api/scenarios/:scenarioId/timelines/:timelineId` - タイムライン更新
- `DELETE /api/scenarios/:scenarioId/timelines/:timelineId` - タイムライン削除

### カード
- `GET /api/scenarios/:scenarioId/cards` - カード一覧
- `POST /api/scenarios/:scenarioId/cards` - カード作成
- `PUT /api/scenarios/:scenarioId/cards/:cardId` - カード更新
- `DELETE /api/scenarios/:scenarioId/cards/:cardId` - カード削除

## デプロイ

### Cloudflare Pages へのデプロイ

1. このリポジトリをGitHubに接続
2. Cloudflare Pages で新しいプロジェクトを作成
3. GitHubリポジトリを選択
4. ビルドコマンド: `pnpm build`
5. ビルド出力ディレクトリ: `dist`

### Cloudflare D1 の設定

1. Cloudflare ダッシュボードで D1 データベースを作成
2. `wrangler.toml` の `database_id` を更新
3. マイグレーションを適用: `wrangler d1 migrations apply personal-site-db --remote`

## 使用方法

1. **ダッシュボード** (`/mystery`) でシナリオを作成
2. **シナリオ詳細** (`/mystery/scenario/:id`) でキャラクター、タイムライン、カードを管理
3. **PDF出力** ボタンでシナリオをPDFとしてエクスポート

## ライセンス

MIT License

## サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。
