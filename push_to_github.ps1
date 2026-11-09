# WriteMaster - GitHub 一鍵上傳與雲端編譯 (PowerShell GUI/CLI)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName Microsoft.VisualBasic
Add-Type -AssemblyName System.Windows.Forms

Set-Location -Path $PSScriptRoot

$promptMsg = @"
請在此貼上您的 GitHub 專案網址：
例如：https://github.com/您的帳號/writemaster-app.git

（提示：請先至 https://github.com/new 建立一個空白專案）
"@

$url = [Microsoft.VisualBasic.Interaction]::InputBox($promptMsg, "WriteMaster - 推送至 GitHub 觸發 APK 自動編譯", "")

if ([string]::IsNullOrWhiteSpace($url)) {
    [System.Windows.Forms.MessageBox]::Show("已取消操作或未輸入網址。", "WriteMaster", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    exit 0
}

$url = $url.Trim()

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "正在設定遠端並推送至: $url" -ForegroundColor Cyan
Write-Host "==================================================="

try {
    git add .
    git commit -m "Update WriteMaster Android App" 2>$null
    git remote remove origin 2>$null
    git remote add origin $url
    git branch -M main
    
    Write-Host "`n正在執行 git push -u origin main ..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        $successMsg = @"
恭喜！程式碼已成功推送至 GitHub！

請在瀏覽器打開您的 GitHub 專案：
1. 點選頂部的 [Actions] 標籤頁
2. 您會看到 [Build Android APK] 正在自動雲端編譯
3. 約 2 分鐘完成後，點擊 [WriteMaster-v1.0-Debug-APK] 即可下載安裝檔！
"@
        [System.Windows.Forms.MessageBox]::Show($successMsg, "上傳成功！APK 正在雲端編譯", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    } else {
        $failMsg = @"
推送未成功完成。可能原因：
1. GitHub 帳號尚未在本機通過認證 (建議使用 GitHub Desktop 登入或檢查 Personal Access Token)。
2. 網址輸入有誤。
3. 遠端儲存庫已有不相容的檔案存在。
"@
        [System.Windows.Forms.MessageBox]::Show($failMsg, "推送失敗提示", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
    }
} catch {
    [System.Windows.Forms.MessageBox]::Show("執行時發生例外: $($_.Exception.Message)", "錯誤", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
}
