# NERV 認知能力適性測驗 - 闖關問答遊戲 🎮

這是一個具備 2000 年代經典日本動漫（如新世紀福音戰士 EVA、科技 HUD）風格的網頁闖關問答遊戲。前端採用 **React + Vite**，後端整合 **Google Sheets** 與 **Google Apps Script (GAS)**，可自動記錄玩家的答題次數、最高分、通關分數等統計數據。

---

## 🌟 遊戲特色

1. **經典動漫風格**：黑/橘高對比配色、幾何斜角面板、CRT 掃描線特效與動態警報條紋，重現 2000 年代機甲科幻感。
2. **多風格關主系統**：使用 **DiceBear API**，預先在瀏覽器快取載入 100 張不同風格（機器人、日系動漫、手繪冒險者、像素風）的關主頭像，答題切換零延遲，並具備互動台詞。
3. **無縫 Mock 模式**：未設定後端網址時，會自動切換為本地模擬模式，並將數據寫入 `LocalStorage`，方便直接體驗與展示。
4. **Google Sheets 自動整合**：自動計算成績、統計關卡次數、覆蓋最高分，並精準記錄首次通關時的答題表現。

---

## 🛠️ 本地開發與啟動

### 1. 安裝與啟動
1. 複製本專案至本地。
2. 安裝專案依賴：
   ```bash
   npm install
   ```
3. 複製環境變數範本並命名為 `.env`：
   ```bash
   cp .env.example .env
   ```
4. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

---

## 📊 Google Sheets 與 GAS 後端部署步驟

1. **準備 Google Sheet**：
   - 建立一份新的 Google 試算表。
   - 新增兩個工作表（Tabs）：
     - **`題目`**：欄位順序必須為：`題號`、`題目`、`A`、`B`、`C`、`D`、`解答`。
     - **`回答`**：欄位順序必須為：`ID`、`闖關次數`、`總分`、`最高分`、`第一次通關分數`、`花了幾次通關`、`最近遊玩時間`。

2. **設定 Google Apps Script (GAS)**：
   - 在試算表頂部選單點選 **「擴充功能」 (Extensions) > 「Apps Script」**。
   - 將專案根目錄下的 [`gas_code.js`](file:///c:/github/personal_profile/gas_code.js) 內容完整複製並貼入編輯器中。
   - 點擊右上角 **「部署」 (Deploy) > 「新建部署」 (New deployment)**。
   - 點選齒輪圖示，選擇 **「網頁應用程式」 (Web App)**。
   - 設定如下：
     - 說明：隨意填寫。
     - 執行身分：選擇 **「我」 (Me)**。
     - 誰有權限存取：選擇 **「任何人」 (Anyone)**。
   - 點擊「部署」，授權 Google 權限後，複製產生的 **「網頁應用程式網址」 (Web App URL)**。
   - 將該網址貼入本地 `.env` 檔案中的 `VITE_GOOGLE_APP_SCRIPT_URL`。

---

## 🚀 部署至 GitHub Pages 流程 (使用 GitHub Actions)

本專案已設定 GitHub Actions 自動部署工作流。當您將程式碼推送（Push）至 GitHub 的 `main` 分支時，會自動進行編譯並部署至 GitHub Pages。

### 1. 在 GitHub 設定環境變數
為了讓 GitHub Actions 在建置時能讀取您的環境變數，請在 GitHub Repository 進行以下設定：

1. **設定 Secret (金鑰/敏感網址)**：
   - 前往您的 GitHub 專案頁面，點選 **`Settings` > `Secrets and variables` > `Actions`**。
   - 點擊 **`New repository secret`**。
   - Name 輸入：`VITE_GOOGLE_APP_SCRIPT_URL`
   - Value 輸入：您的 **Google Apps Script Web App URL**。

2. **設定 Variables (非敏感變數)**：
   - 在同一個 Actions 頁面中，切換至 **`Variables`** 標籤頁。
   - 點擊 **`New repository variable`**。
   - 新增以下變數：
     - `VITE_PASS_THRESHOLD`：通過門檻題數（例如：`3`）。
     - `VITE_QUESTION_COUNT`：每次挑戰題數（例如：`5`）。

### 2. 開啟 GitHub Pages 的 Actions 權限
1. 前往專案的 **`Settings` > `Pages`**。
2. 在 **`Build and deployment` > `Source`** 下拉選單中，將預設的 `Deploy from a branch` 改為 **`GitHub Actions`**。

### 3. 推送程式碼觸發部署
將本專案推送至 GitHub，GitHub Actions 會自動啟動：
```bash
git add .
git commit -m "feat: setup anime quiz game & github action deploy"
git push origin main
```
部署完成後，您的遊戲將會在 `https://<您的帳號>.github.io/<倉庫名稱>/` 上線！
