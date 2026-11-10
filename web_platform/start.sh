#!/usr/bin/env bash
set -e

echo "========================================================"
echo "    筆墨思潮 (WriteMaster AI) 正在為您啟動..."
echo "========================================================"

if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi

streamlit run app.py --server.port 8501 --browser.gatherUsageStats false
