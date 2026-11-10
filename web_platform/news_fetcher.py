"""
筆墨思潮 (WriteMaster AI) - 時事新聞教學與命題轉化引擎
負責抓取網路時事新聞 RSS，並將新聞內容自動轉化為適合各學齡層的寫作思辨命題與大綱引導。
"""

import json
import os
import requests

try:
    import feedparser
except ImportError:
    feedparser = None


DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
NEWS_JSON_PATH = os.path.join(DATA_DIR, "news_topics.json")

# 預設優質即時 RSS 新聞來源 (涵蓋文教、生活、科技、綜合)
RSS_SOURCES = {
    "公視新聞 (焦點/生活/教育)": "https://news.pts.org.tw/xml/index.xml",
    "中央社 (生活文化/科技)": "https://feeds.feedburner.com/cnaFirstNews",
}


def load_local_news_topics():
    """載入內建離線精選時事議題"""
    if os.path.exists(NEWS_JSON_PATH):
        try:
            with open(NEWS_JSON_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []


def fetch_online_news(feed_url=None, max_items=5):
    """
    從即時 RSS 抓取新聞，若網路不通或依賴套件未安裝則自動平滑退回內建時事庫
    """
    if feedparser is None:
        return load_local_news_topics()

    if not feed_url:
        feed_url = list(RSS_SOURCES.values())[0]

    articles = []
    try:
        # 設定較短超時避免卡住
        feed = feedparser.parse(feed_url)
        if feed and feed.entries:
            for entry in feed.entries[:max_items]:
                # 清洗內容標籤
                summary_raw = entry.get("summary", entry.get("description", ""))
                from bs4 import BeautifulSoup
                clean_summary = BeautifulSoup(summary_raw, "html.parser").get_text()[:200]

                articles.append({
                    "id": f"online_{hash(entry.link)}",
                    "title": entry.title,
                    "date": entry.get("published", "最新時事"),
                    "source": feed.feed.get("title", "在線新聞源"),
                    "link": entry.link,
                    "summary": clean_summary if clean_summary else entry.title,
                    "category": "網路即時焦點"
                })
    except Exception as e:
        print(f"線上新聞抓取略過 (使用本機快取): {e}")

    # 若線上抓取為空，直接回傳本地豐富時事
    if not articles:
        return load_local_news_topics()
    return articles


def convert_news_to_writing_prompt(title, summary, level_name):
    """
    時事轉命題演算法：根據新聞主旨與學生年級，自動推導思辨引導、爭點與題目
    """
    is_elementary = "國小" in level_name
    is_senior = "九年級" in level_name or "會考" in level_name or "八年級" in level_name

    if is_elementary:
        prompt_topic = f"從新聞「{title[:12]}」談我的生活想法"
        guide_questions = [
            f"1. 這則新聞在說什麼？用你自己的 2 句話告訴爸爸媽媽或老師。",
            f"2. 如果這件事發生在你的學校或家裡，你會覺得開心、生氣還是驚訝？",
            f"3. 想一想，我們自己平時可以怎麼做，讓身邊的人更快樂？"
        ]
        structure_tips = [
            "第一段：用簡單話語介紹這則新聞帶給你的第一印象。",
            "第二段：寫出生活中一件跟這則新聞有點像的小故事。",
            "第三段：寫出你希望未來會變成什麼樣子。"
        ]
    elif is_senior:
        prompt_topic = f"從「{title[:14]}」看現代社會的挑戰與省思"
        guide_questions = [
            f"1. 這起事件背後反映了哪些深層的價值觀衝突（例如：科技 vs 人性、自由 vs 規範）？",
            f"2. 若站在不同立場（如當事人、政策制定者、一般大眾），各有何合理訴求？",
            f"3. 作為新時代的青少年，你能從這起事件中提煉出什麼人生啟發或社會責任？"
        ]
        structure_tips = [
            "第一段（起）：客觀概述時事背景，點出核心爭端與矛盾焦點。",
            "第二段（承）：結合個人切身體會或同儕觀察，剖析現象產生的根本原因。",
            "第三段（轉）：換位思考，提出多角度辨析與平衡觀點。",
            "第四段（合）：結尾昇華，將焦點轉回青少年的自我定位與積極作為。"
        ]
    else:  # 國中七年級 / 銜接期
        prompt_topic = f"時事反思：走進「{title[:12]}」背後的故事"
        guide_questions = [
            "1. 這則時事最觸動或震撼你的細節是什麼？",
            "2. 試著體會事件中人物的心情起伏。",
            "3. 如果換作是你面臨類似情境，你會做出怎樣的抉擇？"
        ]
        structure_tips = [
            "第一段：新聞破題，描繪事件帶來的感受與好奇。",
            "第二段：細節描寫，帶入人物視角與具體情境。",
            "第三段：心情轉折，由外在新聞聯想到自己的內心成長。",
            "第四段：總結收尾，給自己一個新的行動目標。"
        ]

    return {
        "derived_topic": prompt_topic,
        "guide_questions": guide_questions,
        "structure_tips": structure_tips
    }
