# Changelog

All notable changes to the **筆墨思潮 (WriteMaster)** project will be documented in this file.

## [1.2.0] - 2026-11-26

### 🌐 新增即時雙向翻譯與雙向學習系統 (Bidirectional Real-Time Translation & Learning)
- **寫英文翻中文 (En ➔ Zh)**：英語母語學生可直接輸入英文構思，系統即時轉化為符合大考標準的地道中文作文，並提供成語修辭升級（Rhetoric Polish）。
- **寫中文翻英文 (Zh ➔ En)**：中文母語學生可輸入中文草稿，同步獲得托福/雅思/SAT 考評等級的優雅英文論述，內建中式英文校正（Chinglish Detector）。
- **離線中英作文專用字典 (`bilingual_dict.js`)**：收錄 500+ 作文核心成語、轉折詞（Transitions）、五感摹寫詞彙與金句，無網路 100% 離線可用。
- **混成雙向翻譯引擎 (`translation_engine.js`)**：結合離線核心詞典、開放即時翻譯 API 與 Web Speech API 雙語發音朗讀。
- **雙向鏡像寫作架構規劃 (`REALTIME_TRANSLATION_PLAN.md`)**：提供雙向分欄對照沙盒、句級微觀拆解、近義詞階梯與生詞本設計。

---

## [1.1.0] - 2026-11-26

### 🇺🇸 新增英語母語學生專屬學習鷹架 (Bilingual Scaffolding)
- **中英雙語教學規劃 (`BILINGUAL_PLAN.md`)**：針對國際學校、雙語學童與海外華裔子弟量身打造「英語思維 ➔ 中文寫作表達」之鷹架。
- **全系統 i18n 多語言架構**：規劃頂部 `繁體中文` ⇋ `English` ⇋ `雙語對照` 切換。
- **寫作術語雙語對照**：起承轉合 (Qi-Cheng-Zhuan-He)、審題三步驟 (3-Step Prompt Deconstruction)、五感摹寫 (5 Sensory Imagery)、修辭手法 (Rhetoric Devices)。
- **雙語大考題庫與詞彙包**：歷年真題加入英文題意脈絡、英文引導問題與拼音 (Pinyin) 標註。
- **雙語五維能力雷達圖**：評分維度與教師診斷建議支援雙語對照呈現。

---

## [1.0.0] - 2026-11-10

### 🚀 Initial Public Release (正式發布)

#### 🎓 教育訓練與核心體系
- **K-9 六大身分分級教學**：國小低中高年級、國中七八九年級（會考衝刺），配置專屬目標字數與評量標準。
- **寫作結構與核心技法庫**：審題三步驟、起承轉合四段法、論說五段論法、五感放大鏡、5 大破題法與 4 大結尾昇華法。
- **歷年經典大考題庫庫**：收錄 103~113 年最新國中教育會考真題（含《面對青少年的不滿》等）、基測與國小經典題。
- **階梯漸進練習計畫**：30 / 60 / 90 / 180 / 365 天五大計畫，支援每日任務與打卡計數。
- **時事新聞同步教學引擎**：結合 AI 進校園、校園手機管理、極端氣候、心理韌性等熱門焦點，自動生成正反思辨與寫作題目。
- **五維能力雷達圖與智能健檢**：純本地離線評估篇幅完整度、結構組織力、文采修辭、標點規範、立意情感，換算會考 1~6 級分。

#### 💻 電腦端 Web 平台 (`web_platform/`)
- 基於 Python 3.9+ 與 Streamlit 打造現代化桌面介面。
- 提供 Windows 一鍵自動修復啟動檔 (`start.bat`)，具備環境損壞自動偵測與路徑遷移重建功能。

#### 📱 手機端 APP 與 Android APK (`www/` & `android/`)
- **極速離線 PWA 架構**：純前端原生手感，輕量（<5MB）、免常駐 Python 伺服器，支援「加到主畫面」全螢幕運行。
- **Android 原生工程**：標準 Android Studio / Gradle 專案（Target SDK 34, Min SDK 24），整合硬體加速 WebView 與 LocalStorage 草稿自動存檔。
- **GitHub Actions 雲端自動編譯**：配置 `.github/workflows/build-apk.yml`，自動在雲端產出最新 Release APK。
