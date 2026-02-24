# マーダーミステリー作成支援ツール

マーダーミステリーのシナリオ、キャラクター、タイムライン、手がかりを簡単に作成・管理できるWebアプリケーションです。

## 🎯 主な機能

- **シナリオ管理**: シナリオの作成・編集・削除
- **キャラクター管理**: 登場人物の詳細情報（役割、背景、目的）を管理
- **タイムライン**: イベントの時系列を管理
- **手がかり管理**: 手がかり、アイテム、情報、秘密、証拠を分類管理
- **PDF出力**: メインストーリー、キャラクターシート、カードをPDF出力
- **シナリオプレビュー**: 作成したシナリオを俯瞰して確認

## 🛠️ 技術スタック

| レイヤー | 技術 |
| :--- | :--- |
| **フロントエンド** | Astro, React, Tailwind CSS |
| **バックエンド** | Cloudflare Workers (Astro API Routes) |
| **データベース** | Cloudflare D1 (SQLite) |
| **ホスティング** | Cloudflare Pages |
| **ソース管理** | GitHub |

## 📦 セットアップ手順

### 前提条件
- Node.js 18以上
- pnpm
- Cloudflareアカウント
- Wrangler CLI

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/osushizm/mystery.git
cd mystery

# 依存関係をインストール
pnpm install
```

### Cloudflare D1の設定

1. **D1データベースを作成**
   ```bash
   wrangler d1 create murder-mystery-db
   ```

2. **データベースIDを取得**
   - Cloudflareダッシュボード → Workers & Pages → D1
   - `murder-mystery-db`のIDをコピー

3. **wrangler.tomlを更新**
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "murder-mystery-db"
   database_id = "YOUR_DATABASE_ID"  # ここに取得したIDを貼り付け
   ```

4. **マイグレーションを実行**
   ```bash
   wrangler d1 migrations apply murder-mystery-db --remote
   ```

### ローカル開発

```bash
# 開発サーバーを起動
pnpm run dev

# ブラウザで http://localhost:3000 にアクセス
```

### デプロイ

```bash
# ビルド
pnpm run build

# Cloudflare Pagesにデプロイ
wrangler deploy
```

## 📖 使用方法

### シナリオの作成

1. ホーム画面で「シナリオを作成」をクリック
2. シナリオのタイトルと説明を入力
3. 「シナリオを作成」ボタンをクリック

### シナリオの編集

1. シナリオ一覧から編集したいシナリオを選択
2. 「編集」ボタンをクリック
3. タブを切り替えて各要素を管理
   - **シナリオ基本情報**: タイトルと説明を編集
   - **キャラクター**: 登場人物を追加・編集・削除
   - **タイムライン**: イベントを時系列で管理
   - **カード管理**: 手がかり、アイテムなどを管理

### PDF出力

1. シナリオ編集画面の「PDF出力」セクションで以下を選択:
   - **メインストーリー**: 全体の構成を確認
   - **キャラクターシート**: プレイヤー用の個別シート
   - **カード**: 印刷用カード形式

## 🗂️ ディレクトリ構造

```
mystery/
├── src/
│   ├── components/
│   │   ├── layout/          # レイアウトコンポーネント
│   │   └── murder-mystery/  # マーダーミステリー関連コンポーネント
│   ├── pages/
│   │   ├── api/             # APIエンドポイント
│   │   └── mystery/         # ページ
│   ├── utils/
│   │   ├── api.ts           # API呼び出し関数
│   │   ├── pdf-export.ts    # PDF生成関数
│   │   └── site.ts          # サイト設定
│   └── styles/
├── migrations/              # D1マイグレーションファイル
├── wrangler.toml           # Cloudflare設定
└── package.json
```

## 🔧 API エンドポイント

### Scenarios
- `GET /api/scenarios` - シナリオ一覧を取得
- `POST /api/scenarios` - シナリオを作成
- `GET /api/scenarios/[id]` - シナリオを取得
- `PUT /api/scenarios/[id]` - シナリオを更新
- `DELETE /api/scenarios/[id]` - シナリオを削除

### Characters
- `GET /api/scenarios/[scenarioId]/characters` - キャラクター一覧を取得
- `POST /api/scenarios/[scenarioId]/characters` - キャラクターを作成
- `PUT /api/scenarios/[scenarioId]/characters/[characterId]` - キャラクターを更新
- `DELETE /api/scenarios/[scenarioId]/characters/[characterId]` - キャラクターを削除

### Timelines
- `GET /api/scenarios/[scenarioId]/timelines` - タイムラインを取得
- `POST /api/scenarios/[scenarioId]/timelines` - タイムラインを作成
- `PUT /api/scenarios/[scenarioId]/timelines/[timelineId]` - タイムラインを更新
- `DELETE /api/scenarios/[scenarioId]/timelines/[timelineId]` - タイムラインを削除

### Cards
- `GET /api/scenarios/[scenarioId]/cards` - カード一覧を取得
- `POST /api/scenarios/[scenarioId]/cards` - カードを作成
- `PUT /api/scenarios/[scenarioId]/cards/[cardId]` - カードを更新
- `DELETE /api/scenarios/[scenarioId]/cards/[cardId]` - カードを削除

## 📝 ライセンス

MIT

## 🤝 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を説明してください。

## 📧 サポート

問題が発生した場合は、GitHubのissueを作成してください。
