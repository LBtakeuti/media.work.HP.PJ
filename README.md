# コーポレートサイト

Next.jsとTailwind CSSを使用したコーポレートサイトです。LINEヤフーのデザインを参考にしたモダンなUIを実装しています。

## 機能

- **トップページ**: 企業紹介とサービス概要
- **事業案内（サービス）**: 提供サービスの詳細
- **企業情報**: 会社概要、ミッション、バリュー、沿革
- **ニュース**: お知らせ・最新情報の一覧表示
- **お問い合わせ**: 問い合わせフォーム
- **CMS管理画面（/admin）**: ニュースとお問い合わせの管理
- **画像管理**: 画像のアップロード・管理機能

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form**
- **date-fns**
- **Supabase** (Authentication & Database)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成し、以下の環境変数を設定してください：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Slack通知（オプション）
SLACK_WEBHOOK_URL=your_slack_webhook_url

# サイトURL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Supabase設定の取得方法：**
1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. Settings > API から以下を取得：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` キー → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Supabaseでユーザーを作成

管理画面にアクセスするためのユーザーをSupabaseで作成します：

1. Supabaseダッシュボードで `Authentication` > `Users` を開く
2. `Add User` をクリック
3. メールアドレスとパスワードを入力して作成

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 3. ビルド

```bash
npm run build
```

### 4. 本番環境での起動

```bash
npm start
```

## プロジェクト構造

```
.
├── app/                    # Next.js App Router
│   ├── admin/             # 管理画面
│   ├── api/               # API Routes
│   ├── company/           # 企業情報ページ
│   ├── contact/           # お問い合わせページ
│   ├── news/              # ニュースページ
│   ├── services/          # 事業案内ページ
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # トップページ
├── components/            # 共通コンポーネント
│   ├── Header.tsx         # ヘッダー
│   └── Footer.tsx         # フッター
├── lib/                   # ユーティリティ
│   └── data.ts            # データ管理
├── public/                # 静的ファイル
│   └── uploads/           # アップロードされた画像（自動生成）
└── data/                  # データファイル（自動生成）
    ├── news.json          # ニュースデータ
    └── contacts.json      # お問い合わせデータ
```

## CMS管理画面の使い方

1. `/admin` にアクセス
2. 「ニュース管理」タブでニュースの作成・編集・削除が可能
3. 「お問い合わせ管理」タブでお問い合わせの確認・削除が可能
4. 「画像管理」ボタンから画像のアップロード・管理が可能
   - 対応形式: JPEG、PNG、GIF、WebP
   - 最大ファイルサイズ: 10MB
   - アップロードされた画像は `/uploads/` に保存されます

## データ管理

データは `data/` ディレクトリ内のJSONファイルで管理されます：
- `data/news.json`: ニュースデータ
- `data/contacts.json`: お問い合わせデータ

これらのファイルは自動的に作成されます。

## カスタマイズ

### カラーテーマ

`tailwind.config.ts` でプライマリカラーを変更できます。

### コンテンツの編集

- 企業情報: `app/company/page.tsx`
- サービス情報: `app/services/page.tsx`
- トップページ: `app/page.tsx`

## ライセンス

このプロジェクトはお客様のプロジェクトです。

