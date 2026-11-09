# WriteMaster - 手機即時伺服器啟動器
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location -Path "$PSScriptRoot\www"

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   筆墨思潮 (WriteMaster) - 手機免編譯即時體驗 (PWA)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "【手機開啟 3 步驟】：" -ForegroundColor Yellow
Write-Host "1. 請確保手機已連上與這台電腦【相同的 Wi-Fi】。" -ForegroundColor White
Write-Host "2. 打開手機瀏覽器 (Chrome / Safari)，輸入下方任一網址：" -ForegroundColor White
Write-Host ""

$ips = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet' }).IPAddress
foreach ($ip in $ips) {
    Write-Host "   👉 http://$($ip):8080" -ForegroundColor Green -NoNewline
    if ($ip -eq "10.1.3.14") {
        Write-Host "  (推薦主要網路)" -ForegroundColor Yellow
    } else {
        Write-Host ""
    }
}

Write-Host ""
Write-Host "3. 網頁開啟後，請點選瀏覽器選單的【加到主畫面】：" -ForegroundColor White
Write-Host "   • Android (Chrome)：點右上角 [⋮] ➔ 選擇「加到主畫面」" -ForegroundColor Gray
Write-Host "   • iPhone (Safari)：點底部 [分享] ➔ 選擇「加入主畫面」" -ForegroundColor Gray
Write-Host "   完成後手機桌面即會出現獨立 APP 圖標，全螢幕脫離瀏覽器運行！" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "正在為您啟動伺服器... (若要停止請按 Ctrl + C)" -ForegroundColor Gray
Write-Host ""

Start-Process "http://localhost:8080"
python -m http.server 8080
