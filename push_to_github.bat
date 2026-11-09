@echo off
title Push to GitHub and Trigger APK Build
cd /d "%~dp0"

echo ===================================================
echo   WriteMaster App - GitHub 一鍵上傳與雲端編譯
echo ===================================================
echo.
echo 步驟說明：
echo 1. 請先至 https://github.com/new 建立一個新的空白專案（例如命名為: writemaster-app）
echo 2. 建立時請「不要」勾選 Add README 或 .gitignore
echo 3. 複製該專案的網址（例如: https://github.com/您的帳號/writemaster-app.git）
echo.

set /p REPO_URL="請在此貼上您的 GitHub 專案網址: "

if "%REPO_URL%"=="" (
    echo 【錯誤】未輸入網址，操作已取消。
    pause
    exit /b 1
)

echo.
echo [1/3] 檢查本機檔案變更...
git add .
git commit -m "Update WriteMaster Android App code" >nul 2>&1

echo.
echo [2/3] 設定遠端儲存庫位址...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [3/3] 推送程式碼至 GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo 【提示】若推送失敗，請確認：
    echo 1. 您的 GitHub 帳號已在電腦上完成登入授權（或使用 Personal Access Token / SSH）。
    echo 2. 專案網址是否輸入正確。
) else (
    echo.
    echo ===================================================
    echo  恭喜！程式碼已成功推送至 GitHub！
    echo.
    echo  接下來請在瀏覽器打開您的 GitHub 專案頁面：
    echo  1. 點擊頂部的 [Actions] 標籤頁
    echo  2. 您會看到 [Build Android APK] 正在自動雲端編譯
    echo  3. 大約 2 分鐘後顯示綠色勾勾，進入點擊 [WriteMaster-v1.0-Debug-APK] 即可下載安裝！
    echo ===================================================
)

echo.
pause
