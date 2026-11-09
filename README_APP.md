# 筆墨思潮 (WriteMaster App) — 手機端 APP 與 APK 打包專案

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20PWA-green)
![Architecture](https://img.shields.io/badge/Architecture-Offline%20First%20SPA%20%2B%20WebView-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

**專為學生手機與平板打造的 K-9 階梯式寫作教育訓練 APP**  
*完全免依賴 Python 伺服器・100% 離線可用・原生手感與底部導航・起承轉合分段沙盒・五維能力雷達圖*

</div>

---

## 📱 為何改寫為專屬手機 APP 架構？

原先的 Streamlit 系統適合電腦端 Web 瀏覽，但若要在 Android 手機上單機運行，若包進 Python 解譯器會導致檔案高達 100MB+ 且極度耗電卡頓。  
因此，我們將核心邏輯重構為**純前端極速離線架構（Mobile-First Offline SPA）**，並封裝至 **Android 原生 Gradle / WebView 工程**：

1. ⚡ **極速與輕量**：編譯出的 APK 僅約 **3~5 MB**，秒開無延遲。
2. 📴 **100% 離線可用**：題庫、寫作指南、30~365天計畫與寫作健檢引擎全數內置於 APK Assets，無網路環境亦可隨時練筆。
3. 💾 **離線資料保存 (LocalStorage)**：自動即時儲存學生的文章草稿、連續打卡天數與每日任務勾選進度，不怕意外關閉或當機。
4. 📊 **本機 Canvas 五維雷達圖**：無需載入肥大外部圖表庫，本機高幀率平滑繪製能力維度。

---

## 📂 專案目錄結構

```
d:\ams14\writing_app/
│
├── www/                                # 核心行動端離線應用程式
│   ├── index.html                      # 響應式手機 UI (底部導航列、卡片式設計)
│   ├── css/style.css                   # 手機專屬質感樣式 (Safe-area、沉浸式卡片)
│   └── js/
│       ├── data.js                     # 完整題庫、寫作技法、30~365天計畫與時事資料庫
│       ├── evaluator.js                # 離線智能寫作評估引擎 (篇幅/結構/修辭/五感/雷達圖)
│       └── app.js                      # 手機互動邏輯、打卡、草稿自動保存與事件處理
│
├── android/                            # Android 原生專案工程 (支援編譯 APK)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml     # Android 清單與權限配置
│   │   │   ├── java/com/writemaster/app/MainActivity.java # 沉浸式 WebView 容器
│   │   │   ├── assets/www/             # APK 內建之離線應用程式包 (同步自 www)
│   │   │   └── res/                    # 圖標與字串資源
│   │   └── build.gradle                # App 模組編譯設定 (SDK 34)
│   ├── build.gradle                    # 頂層 Gradle 設定
│   └── settings.gradle                 # 專案名稱定義
│
├── .github/workflows/
│   └── build-apk.yml                   # GitHub Actions 雲端一鍵編譯 APK 自動化腳本
│
├── preview_app.bat                     # Windows 一鍵啟動手機版即時預覽伺服器
└── README_APP.md                       # 本說明手冊
```

---

## 🚀 如何立即體驗與使用

### 方式一：直接在手機瀏覽器上開啟或安裝（免編譯最快）

1. 在電腦上雙擊執行 `preview_app.bat`，系統會啟動本機伺服器並開啟網頁。
2. 讓手機連接至同一 Wi-Fi，打開手機瀏覽器輸入電腦的區域 IP（例如：`http://192.168.1.xxx:8080`）。
3. 點選瀏覽器選單中的 **「加到主畫面」**（Add to Home screen），即可在手機桌面生成專屬 APP 圖標，全螢幕脫離瀏覽器運行！

---

### 方式二：使用 Android Studio 編譯成 APK

若您有安裝 [Android Studio](https://developer.android.com/studio)：

1. 打開 Android Studio，點擊 **Open** 並選擇目錄：`d:\ams14\writing_app\android`。
2. 等待 Gradle 同步完成。
3. 點擊上方選單：**Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)**。
4. 編譯完成後點擊彈出的 **locate**，即可在 `app/build/outputs/apk/debug/app-debug.apk` 取得安裝檔。
5. 將此 `.apk` 傳送至 Android 手機點擊安裝即可！

---

### 方式三：使用 GitHub Actions 免費雲端自動產出 APK（推薦）

我們已在 `.github/workflows/build-apk.yml` 寫好自動化編譯腳本：

1. 將本專案推送至您的 GitHub 儲存庫。
2. 進入 GitHub 專案頁面的 **Actions** 標籤頁。
3. 點擊 **Build Android APK** ➔ **Run workflow**。
4. 約 2 分鐘後編譯完成，在 Actions 執行結果的 **Artifacts** 區塊即可直接下載 `WriteMaster-APK` 安裝檔！

---

## 🌟 手機版五大核心分頁

1. 📖 **指引**：審題三步驟、五感放大鏡、起承轉合四段架構、破題 5 法與收尾 4 法。
2. 📚 **題庫**：103~113 年會考真題（含《面對青少年的不滿》等）、基測與國小題庫，可一鍵將題目「帶入沙盒寫作」。
3. 📅 **計畫**：30 / 60 / 90 / 180 / 365 天挑戰，支援每日任務即時勾選打卡與連續天數計算。
4. 📰 **時事**：AI 學習、校園手機管理、極端氣候、心理韌性等議題，提供思辨引導與分階寫作題目。
5. ✍️ **沙盒**：
   - 起、承、轉、合四大段落專屬輸入框，邊打字邊即時計算字數與自動儲存。
   - 點擊「開始智能診斷」即可秒級產出：**大考預測級分**、**綜合得分**、**五維能力雷達圖**與**具體改寫升級建議**。
