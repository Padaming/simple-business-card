# Simple Business Card - 電子名片系統

一個採用 Clean Architecture 架構的品牌電子名片網站，使用 Next.js + Tailwind CSS 技術棧建立。

## 🌟 功能特色

- **名片檢視頁面**：展示個人或品牌的電子名片，包含頭像、姓名、職稱、公司、簡介、聯絡資訊和社群連結
- **名片編輯器**：即時預覽的編輯介面，可以編輯所有名片欄位
- **主題切換**：提供三種預設主題（簡約、漸層、企業風格），可即時切換
- **響應式設計**：完整支援桌面和行動裝置
- **JSON 匯出**：可將編輯結果匯出為 JSON 檔案
- **靜態部署**：支援 GitHub Pages 等靜態網站託管平台

## 🛠 技術棧

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI 風格元件
- **Icons**: Lucide React
- **Testing**: Jest
- **Architecture**: Clean Architecture (Domain, Infrastructure, Presentation)

## 📁 目錄結構

```
├── app/                    # Next.js App Router
│   ├── cards/[slug]/      # 名片檢視頁（動態路由）
│   ├── editor/            # 名片編輯器頁面
│   ├── page.tsx           # 首頁（名片列表）
│   ├── layout.tsx         # 全局佈局
│   └── globals.css        # 全局樣式
├── domain/                # 核心業務邏輯層
│   ├── entities/          # Card, Theme 等實體定義
│   │   └── Card.ts
│   └── use-cases/         # 業務用例
│       ├── GetCard.ts
│       ├── UpdateCard.ts
│       └── ListCards.ts
├── infrastructure/        # 基礎設施層
│   └── repositories/      # 資料存取實作
│       └── JsonCardRepository.ts
├── presentation/          # 展示層
│   └── components/        # UI 元件
│       ├── ui/           # 基礎 UI 元件
│       ├── CardView.tsx  # 名片展示元件
│       └── CardEditor.tsx # 名片編輯器元件
├── data/                 # 資料目錄
│   └── cards/            # JSON 名片資料檔案
│       ├── john-doe.json
│       ├── jane-smith.json
│       └── alex-chen.json
├── __tests__/            # 測試檔案
│   ├── GetCard.test.ts
│   ├── ListCards.test.ts
│   └── UpdateCard.test.ts
└── lib/                  # 工具函數
    └── utils.ts
```

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 本地開發

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 建置專案

```bash
npm run build
```

### 執行測試

```bash
npm test
```

## 📝 如何新增名片

### 方法 1: 使用編輯器（推薦）

1. 訪問 `/editor` 頁面
2. 填寫名片資訊
3. 選擇主題風格
4. 點擊「匯出 JSON」按鈕下載 JSON 檔案
5. 將 JSON 檔案放入 `/data/cards/` 目錄

### 方法 2: 手動建立 JSON 檔案

在 `/data/cards/` 目錄下建立新的 JSON 檔案，例如 `your-name.json`：

```json
{
  "slug": "your-name",
  "name": "Your Name",
  "title": "Your Title",
  "company": "Your Company",
  "bio": "A brief introduction about yourself...",
  "avatar": "https://example.com/avatar.jpg",
  "theme": "minimal",
  "accentColor": "#4f46e5",
  "contact": {
    "email": "your@email.com",
    "phone": "+886-900-000-000",
    "location": "Your Location"
  },
  "links": [
    {
      "platform": "github",
      "url": "https://github.com/yourusername"
    },
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/in/yourusername"
    }
  ]
}
```

### JSON 欄位說明

- `slug` (必填): URL 識別碼，用於路由 `/cards/{slug}`
- `name` (必填): 姓名
- `title` (必填): 職稱
- `company` (選填): 公司或品牌名稱
- `bio` (選填): 個人簡介
- `avatar` (選填): 頭像圖片 URL
- `theme` (必填): 主題名稱（`minimal` | `gradient` | `corporate`）
- `accentColor` (選填): 主題色（十六進位色碼）
- `contact` (選填): 聯絡資訊物件
  - `email`: Email 地址
  - `phone`: 電話號碼
  - `location`: 地點
- `links` (選填): 社群連結陣列
  - `platform`: 平台名稱（如 github, linkedin, twitter）
  - `url`: 連結 URL

## 🎨 主題系統

系統提供三種預設主題：

1. **Minimal（簡約）**: 簡約淺色風格，適合專業形象
2. **Gradient（漸層）**: 漸層深色風格，視覺效果突出
3. **Corporate（企業）**: 企業專業風格，穩重大方

在編輯器中可以即時切換主題並預覽效果。

## 📦 部署到 GitHub Pages

### 1. 設定 GitHub Repository

確保你的專案已推送到 GitHub。

### 2. 調整 `next.config.js`

專案已預設配置好 GitHub Pages 的設定：

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/simple-business-card' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/simple-business-card/' : '',
}
```

如果你的 repository 名稱不同，請修改 `basePath` 和 `assetPrefix` 為你的 repository 名稱。

### 3. 建置並部署

```bash
# 建置專案
npm run build

# 此時會在 out/ 目錄產生靜態檔案
```

### 4. 使用 GitHub Actions 自動部署（選用）

建立 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### 5. 啟用 GitHub Pages

1. 前往 GitHub Repository 的 Settings
2. 找到 Pages 選項
3. Source 選擇 `gh-pages` 分支
4. 儲存後等待部署完成

你的網站將會部署在 `https://{username}.github.io/{repository-name}/`

## 🧪 測試

專案包含 domain 層的單元測試：

```bash
# 執行所有測試
npm test

# 執行測試並顯示覆蓋率
npm test -- --coverage

# 監聽模式
npm test -- --watch
```

測試檔案位於 `__tests__/` 目錄。

## 🏗 架構說明

本專案採用 Clean Architecture 設計原則：

### Domain Layer（核心層）
- 包含業務實體（Card, Theme）和用例（Use Cases）
- 完全獨立，不依賴任何外部框架或函式庫
- 可被輕鬆測試和重用

### Infrastructure Layer（基礎設施層）
- 實作資料存取（JsonCardRepository）
- 處理與外部系統的互動（檔案系統、API 等）

### Presentation Layer（展示層）
- UI 元件和頁面
- React Hooks 和狀態管理
- 負責與使用者的互動

### 設計原則
- **SOLID 原則**: 高內聚、低耦合
- **依賴反轉**: Domain 層定義介面，Infrastructure 層實作
- **可測試性**: 核心邏輯可獨立測試，不依賴 UI 或資料庫

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

ISC License

## 👨‍💻 作者

Simple Business Card Team
