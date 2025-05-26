# OpenLocal - Railway Deployment Guide

## デプロイメント準備

### 1. 必要な環境変数

Railwayでデプロイする前に、以下の環境変数を設定する必要があります：

#### 必須
- `OPENAI_API_KEY`: OpenAI APIキー

#### オプション
- `OPENAI_ORG_ID`: OpenAI組織ID（必要に応じて）

### 2. Railway デプロイ手順

1. **GitHubリポジトリとの連携**
   - [Railway](https://railway.app)にサインアップ/ログイン
   - "New Project" → "Deploy from GitHub repo"を選択
   - このリポジトリを選択

2. **環境変数の設定**
   - プロジェクトダッシュボードで "Variables"タブを選択
   - `OPENAI_API_KEY`を追加し、あなたのAPIキーを設定

3. **自動デプロイ**
   - Railwayが自動的に`requirements.txt`を検出
   - `Procfile`に基づいてアプリケーションを起動
   - `railway.json`の設定に従ってデプロイ

### 3. デプロイ後の確認

- アプリケーションが正常に起動することを確認
- OpenAI APIへの接続テスト
- 多言語機能の動作確認

### 4. トラブルシューティング

#### よくある問題:

1. **OPENAI_API_KEY not found**
   - 環境変数が正しく設定されているか確認
   - APIキーが有効か確認

2. **Port binding error**
   - Railwayが自動的に`$PORT`環境変数を設定するため、手動設定は不要

3. **File not found errors**
   - データディレクトリが正しく作成されているか確認
   - アプリケーションが書き込み権限を持っているか確認

### 5. ファイル構成

```
openlocal/
├── Procfile                # Railway起動コマンド
├── railway.json           # Railway設定
├── requirements.txt       # Python依存関係
├── openlocal_main.py     # メインアプリケーション
├── templates/            # HTMLテンプレート
├── static/              # 静的ファイル
└── data/                # データファイル（自動作成）
```

## ローカル開発

ローカルで開発する場合：

1. 依存関係のインストール:
```bash
pip install -r requirements.txt
```

2. 環境変数の設定:
```bash
export OPENAI_API_KEY=your_api_key_here
```

3. アプリケーションの起動:
```bash
uvicorn openlocal_main:app --reload --host 0.0.0.0 --port 8000
```

## 機能

- 多言語対応（日本語、英語、韓国語、中国語、スペイン語、フランス語）
- GPT連携による自動翻訳・返信
- 地域ベースの投稿フィルタリング
- リアルタイム検索機能
- レスポンシブWebデザイン 