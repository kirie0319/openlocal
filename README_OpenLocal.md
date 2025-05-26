# OpenLocal - 翻訳対応型スレッド掲示板SNS

## 🌐 プロダクト概要

**OpenLocal**は、GPT + 地元住民が多言語で助け合う、翻訳対応型スレッド掲示板SNSです。

### 🎯 主な特徴

- **多言語対応**: 6言語（日本語、英語、韓国語、中国語、スペイン語、フランス語）に対応
- **GPT自動回答**: 投稿に対してGPTが即座に仮回答を生成
- **地域フィルタリング**: 地元モードで地域限定の投稿を表示
- **リアルタイム翻訳**: ユーザーの設定言語に自動翻訳
- **簡易認証**: ユーザー名のみでの簡単ログイン

## 🏗️ 技術スタック

- **Backend**: FastAPI (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **AI**: OpenAI GPT-3.5-turbo
- **Data Storage**: JSON ファイル（ローカルストレージ）
- **Icons**: Font Awesome

## 📋 機能一覧

### 🔐 ユーザー認証
- ユーザー名のみでの簡易登録・ログイン
- UUID ベースのユーザー管理
- 言語設定・地域設定

### 📝 投稿機能
- スレッド形式の投稿作成
- 地域限定投稿オプション
- GPTによる自動初回回答
- 投稿検索機能

### 💬 返信機能
- スレッドへの返信投稿
- GPT回答の識別表示
- 返信数カウント

### 🌍 翻訳機能
- 投稿・返信の自動翻訳
- 翻訳キャッシュ機能
- 原文表示切り替え

### 🏘️ 地域機能
- 地元モード/オープンモード切り替え
- 地域別投稿フィルタリング
- 地域限定投稿

## 🚀 セットアップ手順

### 1. 必要な環境

- Python 3.8+
- OpenAI API キー

### 2. インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd openlocal

# 仮想環境を作成
python -m venv venv

# 仮想環境を有効化
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 依存関係をインストール
pip install -r requirements.txt
```

### 3. 環境設定

環境変数を設定するか、`openlocal_main.py`内のOpenAI APIキーを直接設定してください：

```bash
# 環境変数として設定
export OPENAI_API_KEY="your-openai-api-key-here"
```

または、`.env`ファイルを作成：

```env
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. アプリケーション起動

```bash
# OpenLocalアプリを起動
python openlocal_main.py
```

ブラウザで `http://localhost:8000` にアクセスしてください。

## 📁 プロジェクト構造

```
openlocal/
├── openlocal_main.py          # メインアプリケーション
├── requirements.txt           # Python依存関係
├── templates/
│   └── index.html            # メインHTMLテンプレート
├── static/
│   ├── css/
│   │   └── style.css         # カスタムスタイル
│   └── js/
│       └── app.js            # フロントエンドJavaScript
└── data/                     # JSONデータファイル（自動生成）
    ├── users.json            # ユーザーデータ
    ├── posts.json            # 投稿データ
    ├── replies.json          # 返信データ
    └── translations.json     # 翻訳キャッシュ
```

## 🔧 API エンドポイント

### 認証
- `POST /api/register` - ユーザー登録
- `POST /api/login` - ユーザーログイン

### 投稿
- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 新規投稿作成

### 返信
- `GET /api/posts/{post_id}/replies` - 返信一覧取得
- `POST /api/posts/{post_id}/replies` - 返信作成

### 翻訳
- `GET /api/translate` - テキスト翻訳

## 🎨 UI/UX 特徴

### デザイン
- モダンでクリーンなインターフェース
- レスポンシブデザイン（モバイル対応）
- ダークモード対応
- アニメーション効果

### ユーザビリティ
- 直感的な操作
- リアルタイムフィードバック
- トースト通知
- ローディング表示

## 🌟 主要機能の詳細

### GPT統合
- 投稿作成時に自動でGPTが初回回答を生成
- 地域コミュニティに適した親しみやすい回答
- エラー時のフォールバック機能

### 翻訳システム
- OpenAI GPTを使用した高品質翻訳
- 翻訳結果のキャッシュ機能
- 6言語対応（日本語、英語、韓国語、中国語、スペイン語、フランス語）

### 地域フィルタリング
- 地元モード：同じ地域の投稿のみ表示
- オープンモード：全ての投稿を表示
- 地域限定投稿機能

## 🔒 セキュリティ

- ユーザー入力のサニタイゼーション
- XSS攻撃対策
- UUID ベースのユーザー識別
- 匿名性の保護

## 🚧 今後の拡張予定

- [ ] データベース統合（PostgreSQL/MongoDB）
- [ ] リアルタイム通知機能
- [ ] 画像投稿機能
- [ ] いいね・評価機能
- [ ] モデレーション機能
- [ ] PWA対応
- [ ] 多言語UI対応

## 🤝 貢献

プロジェクトへの貢献を歓迎します！

1. フォークしてください
2. フィーチャーブランチを作成してください (`git checkout -b feature/AmazingFeature`)
3. 変更をコミットしてください (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュしてください (`git push origin feature/AmazingFeature`)
5. プルリクエストを開いてください

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。

---

**OpenLocal** - 地域コミュニティをつなぐ、多言語対応掲示板SNS 🌍 