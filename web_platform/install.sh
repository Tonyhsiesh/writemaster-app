#!/usr/bin/env bash
set -e

echo "========================================================"
echo "    筆墨思潮 (WriteMaster AI) - 一鍵環境安裝程式 (Unix)"
echo "========================================================"

command -v python3 >/dev/null 2>&1 || {
    echo "【錯誤】未找到 python3，請先安裝 Python 3.9+。"
    exit 1
}

echo "[1/3] 建立虛擬環境 (.venv)..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

echo "[2/3] 啟用虛擬環境並升級 pip..."
source .venv/bin/activate
pip install --upgrade pip

echo "[3/3] 安裝依賴套件..."
pip install -r requirements.txt

echo "========================================================"
echo "  安裝完成！請執行 ./start.sh 啟動應用程式。"
echo "========================================================"
