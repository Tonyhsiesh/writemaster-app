// 筆墨思潮 (WriteMaster App) - 行動端離線智能寫作評估引擎
const Evaluator = {
  rhetoricPatterns: {
    "譬喻": [/像/g, /如同/g, /好比/g, /猶如/g, /恰似/g, /是一顆/g, /是一處/g, /是一扇/g],
    "擬人": [/低語/g, /雀躍/g, /奔跑著/g, /伸了個懶腰/g, /對我微笑/g, /唱著歌/g, /哭泣/g],
    "設問": [/\？/g, /\?/g, /難道/g, /豈不/g, /何嘗/g, /為什麼/g, /究竟/g],
    "排比": [/有的.+有的.+有的/g, /時而.+時而.+時而/g, /或是.+或是.+或是/g],
    "映襯對比": [/雖然.+但是/g, /一方面.+另一方面/g, /表面上.+實際上/g]
  },

  sensoryWords: {
    "視覺": ["映入", "斑駁", "耀眼", "昏黃", "色彩", "明媚", "翠綠", "燦爛"],
    "聽覺": ["響徹", "淅淅瀝瀝", "蟬鳴", "轟隆", "清脆", "細語", "喧囂", "滴答"],
    "嗅/味覺": ["芬芳", "清香", "苦澀", "甘甜", "焦香", "刺鼻", "香氣"],
    "觸覺": ["沁涼", "溫暖", "粗糙", "滾燙", "黏膩", "微風", "刺痛"]
  },

  evaluate(fullText, paragraphs, levelName) {
    if (!fullText || fullText.trim().length === 0) return null;

    const cleanText = fullText.replace(/\s+/g, '');
    const totalWords = cleanText.length;
    const std = APP_DATA.levelStandards[levelName] || APP_DATA.levelStandards["國中九年級 (會考衝刺)"];

    // 1. 篇幅分數
    let lengthScore = 80;
    let lengthComment = "";
    if (totalWords < std.min) {
      lengthScore = Math.max(30, Math.round((totalWords / std.min) * 70));
      lengthComment = `⚠️ 篇幅稍顯不足（目前 ${totalWords} 字，建議至少達到 ${std.min} 字以上）。`;
    } else if (totalWords > std.max + 200) {
      lengthScore = 85;
      lengthComment = `ℹ️ 篇幅略長（目前 ${totalWords} 字），考場中請注意時間分配與精練度。`;
    } else {
      lengthScore = 95;
      lengthComment = `✅ 字數標準（目前 ${totalWords} 字），完美落在該年級建議區間（${std.min}~${std.max} 字）！`;
    }

    // 2. 段落結構
    const validParas = paragraphs ? paragraphs.filter(p => p.trim().length > 0) : fullText.split('\n').filter(p => p.trim().length > 0);
    const paraCount = validParas.length;
    let structScore = 70;
    let structComment = "";
    if (paraCount < 3) {
      structScore = 65;
      structComment = "⚠️ 段落偏少，建議至少拆分為『起、承、轉、合』3~4 個完整段落，層次更清晰。";
    } else if (paraCount >= 3 && paraCount <= 5) {
      structScore = 92;
      structComment = `✅ 段落結構分明（共 ${paraCount} 段），符合大考起承轉合標準結構！`;
    } else {
      structScore = 85;
      structComment = `ℹ️ 段落數較多（共 ${paraCount} 段），請檢查是否有多個單句成段的情況。`;
    }

    // 3. 修辭手法檢測
    const foundRhetorics = [];
    let rhetoricScore = 70;
    for (const [rName, patterns] of Object.entries(this.rhetoricPatterns)) {
      let hit = false;
      for (const p of patterns) {
        if (p.test(fullText)) {
          hit = true;
          break;
        }
      }
      if (hit) foundRhetorics.push(rName);
    }
    rhetoricScore = Math.min(98, rhetoricScore + foundRhetorics.length * 6);
    let rhetoricComment = foundRhetorics.length > 0 
      ? `🌟 捕捉到生動修辭：${foundRhetorics.join('、')}。讓文章更富感染力！`
      : "💡 建議在文章中加入 1~2 個譬喻句或排比句，文章會瞬間生色不少！";

    // 4. 感官摹寫
    const foundSenses = [];
    for (const [sName, words] of Object.entries(this.sensoryWords)) {
      for (const w of words) {
        if (fullText.includes(w)) {
          foundSenses.push(sName);
          break;
        }
      }
    }

    // 5. 標點檢測
    const suggestions = [];
    let punctScore = 95;
    if ((fullText.match(/!/g) || []).length > 5) {
      punctScore -= 10;
      suggestions.push("驚嘆號使用稍頻繁，建議多以深沉的情感描摹取代連續驚嘆。");
    }
    if (/[,?!]/.test(fullText)) {
      punctScore -= 5;
      suggestions.push("偵測到部分半形標點符號，請統一使用全形標點（，。？！）。");
    }

    // 綜合總分
    const overallScore = Math.round(lengthScore * 0.25 + structScore * 0.25 + rhetoricScore * 0.3 + punctScore * 0.2);

    // 級分換算
    let capGrade = "4 級分 (切合題意，基本流暢)";
    if (overallScore >= 90) capGrade = "6 級分 (立意深遠，文采斐然)";
    else if (overallScore >= 80) capGrade = "5 級分 (結構完整，條理清晰)";
    else if (overallScore >= 70) capGrade = "4 級分 (切合題意，基本流暢)";
    else if (overallScore >= 60) capGrade = "3 級分 (篇幅稍欠，結構待強)";
    else capGrade = "1~2 級分 (需加強基本句型與題意)";

    if (totalWords < std.min) {
      suggestions.unshift(`擴充事例細節與心理感受描摹，讓字數跨過 ${std.min} 字目標。`);
    }
    if (!foundRhetorics.includes("譬喻")) {
      suggestions.push("試著加入譬喻修辭：把心中的抽象感受比喻為大自然或具象事物。");
    }
    if (foundSenses.length === 0) {
      suggestions.push("善用五感觀察法：描寫周遭環境的光線（視覺）或聲音（聽覺），營造臨場感。");
    }
    if (suggestions.length === 0) {
      suggestions.push("表現非常優異！建議在結尾處進一步融入個人深層哲思，挑戰滿級分！");
    }

    return {
      totalWords,
      overallScore,
      capGrade,
      dimensions: {
        labels: ["篇幅完整", "結構組織", "文采修辭", "標點規範", "立意情感"],
        scores: [lengthScore, structScore, rhetoricScore, punctScore, Math.min(95, overallScore + 2)]
      },
      lengthComment,
      structComment,
      rhetoricComment,
      foundRhetorics,
      foundSenses: [...new Set(foundSenses)],
      suggestions
    };
  }
};
