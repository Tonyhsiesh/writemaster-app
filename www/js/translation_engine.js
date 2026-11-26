// 筆墨思潮 (WriteMaster) - 混成雙向即時翻譯與學習引擎 (Hybrid Translation Engine)
// 支援 100% 離線成語/詞彙對照、句型轉化與在線平滑擴展

const TranslationEngine = {
  // 翻譯方向
  DIRECTION: {
    EN_TO_ZH: "en_to_zh",
    ZH_TO_EN: "zh_to_en"
  },

  // 1. 離線作文詞彙與成語智能推薦
  findSuggestions(inputKeyword, direction = "en_to_zh") {
    if (!inputKeyword || inputKeyword.trim().length === 0) return [];
    if (typeof BILINGUAL_DICT === "undefined") return [];

    return BILINGUAL_DICT.lookup(inputKeyword);
  },

  // 2. 混成雙向即時翻譯 (Hybrid Translation)
  async translate(text, direction = "en_to_zh") {
    if (!text || text.trim().length === 0) return "";

    const trimmed = text.trim();

    // 先行比對離線成語/短語庫
    if (typeof BILINGUAL_DICT !== "undefined") {
      const match = BILINGUAL_DICT.idioms.find(item => {
        if (direction === this.DIRECTION.EN_TO_ZH) {
          return item.en.toLowerCase().includes(trimmed.toLowerCase());
        } else {
          return item.zh === trimmed;
        }
      });
      if (match) {
        return direction === this.DIRECTION.EN_TO_ZH 
          ? `${match.zh} (${match.pinyin}) - ${match.example_zh}`
          : `${match.en} - ${match.example_en}`;
      }
    }

    // 若有網路環境，可呼叫開放即時翻譯介面 (帶超時與自動降級)
    try {
      const langPair = direction === this.DIRECTION.EN_TO_ZH ? "en|zh-TW" : "zh-TW|en";
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${langPair}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5秒超時防卡死
      
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) {
          return data.responseData.translatedText;
        }
      }
    } catch (err) {
      console.warn("在線翻譯略過或離線中，使用本機對照:", err.message);
    }

    // 離線降級提示
    return direction === this.DIRECTION.EN_TO_ZH
      ? `[離線對照] ${trimmed} (請參考上方詞彙推薦面板進行寫作潤色)`
      : `[Offline] ${trimmed} (Refer to the suggested vocabulary panel for advanced prose)`;
  },

  // 3. 語音合成朗讀 (Text-to-Speech)
  speak(text, lang = "zh-TW") {
    if (!('speechSynthesis' in window)) {
      console.warn("當前裝置不支援語音合成");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // 稍慢利於教學聆聽
    window.speechSynthesis.speak(utterance);
  }
};

// 支援模組匯出
if (typeof module !== "undefined" && module.exports) {
  module.exports = TranslationEngine;
}
