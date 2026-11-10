# 筆墨思潮 (WriteMaster) — K-9 分級階梯式寫作教育訓練系統

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Android%20APK%20%7C%20PWA%20%7C%20Web-blue)
![Android SDK](https://img.shields.io/badge/Android%20SDK-34-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9%2B-green)
![License](https://img.shields.io/badge/License-MIT-purple)
![Build](https://img.shields.io/badge/GitHub%20Actions-Automated%20APK%20Build-success)

**專為華語學子量身打造的分級階梯寫作訓練平台**  
*涵蓋國小低中高年級至國中會考衝刺・103~113年歷年大考真題・30至365天漸進計畫・即時時事思辨・Android APK 雲端編譯・手機離線 PWA・電腦端 Web 雙軌支援*

</div>

---

## 🌟 專案核心特色

1. 🎯 **六大身分階梯引導 (K-9 Progression)**
   - 國小低年級（1~2年級）：看圖說話、五感探索、短句擴寫（50~150字）
   - 國小中年級（3~4年級）：四素記敘（人事時地）、三/四段起步、譬喻擬人修辭（200~350字）
   - 國小高年級（5~6年級）：立意取材、深層抒情、夾敘夾議、倒敘（400~600字）
   - 國中七年級（國一銜接）：情境感悟、借景抒情、情節波瀾（500~700字）
   - 國中八年級（國二深化）：論說三要素（論點/論據/論證）、對比映襯、社會現象（600~800字）
   - 國中九年級（會考衝刺）：會考六級分標準、圖表非連續文本審題、哲思昇華（700~1000字）

2. 💡 **「如何寫文章」系統化拆解**
   - 審題三步驟（圈題眼、辨文體、立主旨）、起承轉合黃金四段法、論說五段論法。
   - 五感觀察放大鏡（視、聽、嗅、味、觸）及 5 大破題法與 4 大收尾昇華法。

3. 📚 **歷年大考真題與精選題庫庫**
   - 收錄 103~113 年最新國中教育會考真題（《面對青少年的不滿》、《台灣各世代消費調查》、《多做多得》、《未完成的夢》、《我想開一家這樣的店》等）及基測與國小經典題，支援一鍵將題目帶入沙盒練筆。

4. 📅 **30 / 60 / 90 / 180 / 365 天刻意練習計畫**
   - 依照不同階段提供每日示範任務、每週檢核與連續打卡記錄。

5. 📰 **即時時事新聞同步思辨**
   - 涵蓋 AI 進校園、校園手機管理、極端氣候、運動員心理韌性等熱門焦點，自動轉化為正反爭點與分階寫作題目。

6. ✍️ **互動沙盒與五維雷達圖評估**
   - 分段引導寫作（起承轉合逐段提示與即時字數統計）。
   - 純本地/離線智能健檢：篇幅完整度、結構組織力、文采修辭、標點規範、立意情感，換算會考 1~6 級分並給出具體改寫建議。

---

## 📂 專案目錄結構

```
writemaster-app/
│
├── www/                                # 📱 手機離線 PWA 核心應用 (HTML5 / CSS / JS)
│   ├── index.html                      # 響應式手機介面 (底部導航列、卡片設計)
│   ├── manifest.json                   # PWA 應用程式設定
│   ├── sw.js                           # 離線 Service Worker 快取
│   ├── css/style.css                   # 手機專屬質感樣式
│   └── js/
│       ├── data.js                     # 題庫、技法、計畫與時事資料庫
│       ├── evaluator.js                # 離線智慧寫作評估與雷達圖引擎
│       └── app.js                      # 互動邏輯、打卡與草稿自動存檔
│
├── android/                            # 🤖 Android 原生 Studio / Gradle 專案
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml     # 清單與權限配置
│   │   │   ├── java/com/writemaster/app/MainActivity.java # 硬體加速 WebView
│   │   │   └── assets/www/             # APK 內建之完全離線資產 (同步自 www)
│   │   └── build.gradle                # App 模組編譯設定 (SDK 34)
│   ├── build.gradle                    # 頂層 Gradle 設定
│   └── settings.gradle                 # 專案名稱
│
├── web_platform/                       # 💻 電腦端 Web 平台 (Python Streamlit)
│   ├── app.py                          # Streamlit 主程式
│   ├── evaluator.py                    # Python 文章健檢引擎
│   ├── news_fetcher.py                 # RSS 即時時事新聞擷取模組
│   ├── requirements.txt                # Python 依賴套件
│   ├── start.bat                       # Windows 一鍵啟動 (具備自動環境修復)
│   └── install.bat                     # Windows 一鍵安裝腳本
│
├── .github/workflows/
│   └── build-apk.yml                   # ⚙️ GitHub Actions 雲端自動編譯 APK
│
├── push_to_github.bat                  # 一鍵推送到 GitHub 觸發雲端編譯
├── start_mobile.bat                    # 一鍵啟動手機版區域預覽伺服器
├── VERSION                             # 當前版本號 (1.0.0)
├── CHANGELOG.md                        # 版本變更記錄
└── README.md                           # 本專案完整規格與使用手冊
```

---

## 🚀 快速上手指南

### 1. 手機端 APP：使用 GitHub Actions 雲端自動編譯 APK
1. 將專案推送到您的 GitHub。
2. 進入專案頁面的 **Actions** 標籤頁。
3. 點選 **Build Android APK**，GitHub 雲端會在 2 分鐘內自動編譯。
4. 在執行結果的 **Artifacts** 區塊直接下載 **`WriteMaster-v1.0-Debug-APK`**，解壓縮後傳入 Android 手機即可安裝！

### 2. 手機端免編譯：即時在手機瀏覽器開啟並加到桌面 (PWA)
1. 雙擊執行目錄下的 `start_mobile.bat`。
2. 確保手機與電腦在同一 Wi-Fi 下，用手機瀏覽器開啟畫面顯示的網址（如 `http://10.1.3.14:8080`）。
3. 點擊瀏覽器選單 **「加到主畫面」**（Android Chrome 點右上角選單；iPhone Safari 點下方分享按鈕）。
4. 手機桌面即會產生專屬 APP 圖示，像原生 APP 一樣全螢幕極速運行！

### 3. 電腦端 Web 平台 (Python Streamlit)
1. 進入 `web_platform/` 目錄。
2. 雙擊執行 `start.bat`。
3. 系統會自動檢測環境、安裝必要套件並自動在預設瀏覽器開啟 `http://localhost:8501`。

---

## 📄 授權條款

本專案採用 [MIT License](LICENSE) 開源授權。
