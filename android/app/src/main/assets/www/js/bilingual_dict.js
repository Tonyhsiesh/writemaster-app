// 筆墨思潮 (WriteMaster) - 中英雙向作文辭典與成語修辭庫 (Bilingual Writing Dictionary)
// 支援離線秒查、成語對照、五感摹寫、寫作轉折詞與美化金句

const BILINGUAL_DICT = {
  // 1. 核心成語與進階修辭對照 (Idioms & Advanced Rhetoric)
  idioms: [
    {
      zh: "破繭而出",
      pinyin: "pò jiǎn ér chū",
      en: "break through the cocoon; emerge transformed after struggles",
      category: "成長/成長轉折",
      example_zh: "經歷了挫折與淬鍊，他終於破繭而出，展現出驚人的勇氣。",
      example_en: "Through trials and tribulations, she finally emerged transformed, displaying extraordinary courage."
    },
    {
      zh: "堅持不懈",
      pinyin: "jiān chí bù xiè",
      en: "unremitting perseverance; persevere tirelessly",
      category: "毅力/奮鬥",
      example_zh: "只要堅持不懈，即使微小的水滴也能穿透堅硬的岩石。",
      example_en: "With unremitting perseverance, even tiny drops of water can penetrate the hardest rock."
    },
    {
      zh: "苦口婆心",
      pinyin: "kǔ kǒu pó xīn",
      en: "urge earnestly and repeatedly with good intentions",
      category: "親情/教誨",
      example_zh: "面對母親的苦口婆心，我終於體會到嚴厲背後那份深沉的愛意。",
      example_en: "Listening to my mother's earnest advice, I finally recognized the deep love behind her strictness."
    },
    {
      zh: "悵然若失",
      pinyin: "chàng rán ruò shī",
      en: "feeling a profound sense of loss and melancholy",
      category: "情緒/失落",
      example_zh: "看著空蕩蕩的舊琴房，心中湧起一股難以言喻的悵然若失。",
      example_en: "Looking at the empty old music room, an unspeakable sense of loss washed over my heart."
    },
    {
      zh: "百折不撓",
      pinyin: "bǎi zhé bù náo",
      en: "indomitable; undaunted by repeated setbacks",
      category: "毅力/逆境",
      example_zh: "運動員百折不撓的拚搏精神，深深撼動了在場每一位觀眾。",
      example_en: "The athlete's indomitable spirit deeply moved every spectator present."
    },
    {
      zh: "逆境生花",
      pinyin: "nì jìng shēng huā",
      en: "blossom amidst adversity; triumph over hardship",
      category: "哲理/啟發",
      example_zh: "生命最動人之處，莫過於在最崎嶇的逆境中綻放希望之花。",
      example_en: "The most moving aspect of life is blossoming with hope amidst the harshest adversity."
    },
    {
      zh: "恍然大悟",
      pinyin: "huǎng rán dà wù",
      en: "suddenly see the light; an epiphany dawns upon someone",
      category: "頓悟/轉折",
      example_zh: "聽完老師的一番話，我恍然大悟，解開了心中積壓已久的結。",
      example_en: "Upon hearing the teacher's words, an epiphany dawned upon me, untying the knot in my heart."
    },
    {
      zh: "循序漸進",
      pinyin: "xún xù jiàn jìn",
      en: "step by step; proceed in an orderly, progressive sequence",
      category: "學習/進步",
      example_zh: "寫作能力的培養必須循序漸進，無法一蹴可幾。",
      example_en: "The cultivation of writing competence must proceed step by step, never achieved overnight."
    },
    {
      zh: "落霞餘暉",
      pinyin: "luò xiá yú huī",
      en: "the lingering glow of the sunset; twilight embers",
      category: "寫景/感官",
      example_zh: "落霞餘暉灑在操場跑道上，將我們的身影拉得悠長溫柔。",
      example_en: "The lingering glow of the sunset bathed the running track, stretching our shadows long and gentle."
    },
    {
      zh: "風雨交加",
      pinyin: "fēng yǔ jiāo jiā",
      en: "buffeted by wind and rain; tempestuous weather or ordeal",
      category: "情境/衝突",
      example_zh: "在那場風雨交加的午後，我學會了獨自撐起一把傘前行。",
      example_en: "On that tempestuous afternoon, I learned to hold my own umbrella and press forward alone."
    }
  ],

  // 2. 雙向常用轉折與銜接詞 (Transitions & Connectors)
  transitions: [
    { zh: "然而 / 不過", en: "However / Yet / Conversely", usage: "製造轉折，引出衝突或新觀點" },
    { zh: "正因如此", en: "Precisely for this reason / Consequently", usage: "因果承接，強化論證必然性" },
    { zh: "殊不知", en: "Little did I realize / Unbeknownst to me", usage: "反思回溯，打破先前的誤解" },
    { zh: "總而言之 / 綜上所述", en: "In summary / In essence / To encapsulate", usage: "收尾結語，昇華主旨" },
    { zh: "相形之下", en: "In sharp contrast / By comparison", usage: "映襯對比，凸顯兩者差異" },
    { zh: "驀然回首", en: "Looking back in retrospect", usage: "由景入情，回顧過往體悟" },
    { zh: "毋庸置疑", en: "Undoubtedly / Beyond a shadow of a doubt", usage: "堅定立論，增強論述說服力" }
  ],

  // 3. 五感描寫雙向詞庫 (Sensory Writing Terms)
  sensory: {
    visual: [
      { zh: "斑駁碎金", en: "dappled sunlight / flecks of gold" },
      { zh: "耀眼奪目", en: "dazzling and brilliant" },
      { zh: "昏黃微光", en: "dim warm glow" },
      { zh: "煙雨濛濛", en: "misty drizzle" }
    ],
    auditory: [
      { zh: "淅淅瀝瀝", en: "pitter-patter of gentle rain" },
      { zh: "蟬鳴如潮", en: "surging waves of cicada chirps" },
      { zh: "清脆悠揚", en: "crisp and melodious" },
      { zh: "震耳欲聾", en: "deafening roar" }
    ],
    tactile: [
      { zh: "粗糙老繭", en: "rough, calloused hands" },
      { zh: "微風拂面", en: "gentle breeze caressing the face" },
      { zh: "沁涼徹骨", en: "piercingly refreshing / bone-chilling" },
      { zh: "滾燙熱淚", en: "scalding tears" }
    ],
    olfactory_gustatory: [
      { zh: "淡淡焦香", en: "subtle toasted aroma" },
      { zh: "苦盡甘來", en: "sweetness after bitterness" },
      { zh: "芬芳撲鼻", en: "assaulted by fragrant aromas" },
      { zh: "回味無窮", en: "lingering aftertaste" }
    ]
  },

  // 4. 快速關鍵詞查找助手
  lookup(keyword) {
    if (!keyword) return [];
    const q = keyword.trim().toLowerCase();
    return this.idioms.filter(item => 
      item.zh.includes(q) || 
      item.pinyin.toLowerCase().includes(q) || 
      item.en.toLowerCase().includes(q) ||
      item.category.includes(q)
    );
  }
};

// 支援瀏覽器與 Node.js 雙環境匯出
if (typeof module !== "undefined" && module.exports) {
  module.exports = BILINGUAL_DICT;
}
