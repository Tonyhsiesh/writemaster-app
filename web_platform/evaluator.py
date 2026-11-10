"""
筆墨思潮 (WriteMaster AI) - 寫作智慧診斷與多維評估引擎
針對不同年級與身分，提供篇幅、修辭、段落平衡、標點符號與立意深度的即時健檢報告。
"""

import re

# 各年級標準字數建議
LEVEL_WORD_STANDARDS = {
    "國小低年級 (1~2年級)": {"min": 50, "ideal": 120, "max": 200},
    "國小中年級 (3~4年級)": {"min": 180, "ideal": 280, "max": 400},
    "國小高年級 (5~6年級)": {"min": 350, "ideal": 500, "max": 650},
    "國中七年級 (國一銜接)": {"min": 450, "ideal": 600, "max": 750},
    "國中八年級 (國二深化)": {"min": 550, "ideal": 700, "max": 850},
    "國中九年級 (會考衝刺)": {"min": 650, "ideal": 800, "max": 1000},
}

# 修辭辨識關鍵字與正則
RHETORIC_PATTERNS = {
    "譬喻 (Simile/Metaphor)": [r"像", r"如同", r"好比", r"猶如", r"恰似", r"是一顆", r"是一處", r"是一扇"],
    "擬人 (Personification)": [r"低語", r"雀躍", r"奔跑著", r"伸了個懶腰", r"對我微笑", r"唱著歌", r"哭泣"],
    "設問 (Rhetorical Question)": [r"\？", r"\?", r"難道", r"豈不", r"何嘗", r"為什麼", r"究竟"],
    "排比 (Parallelism)": [r"(有的.+有的.+有的)", r"(時而.+時而.+時而)", r"(或是.+或是.+或是)"],
    "映襯對比 (Contrast)": [r"雖然.+但是", r"一方面.+另一方面", r"表面上.+實際上", r"與其.+不如"]
}

# 五感描寫關鍵詞
SENSORY_WORDS = {
    "視覺": ["映入", "斑駁", "耀眼", "昏黃", "色彩", "明媚", "翠綠", "燦爛"],
    "聽覺": ["響徹", "淅淅瀝瀝", "蟬鳴", "轟隆", "清脆", "細語", "喧囂", "滴答"],
    "嗅覺/味覺": ["芬芳", "清香", "苦澀", "甘甜", "焦香", "刺鼻", "香氣"],
    "觸覺/體感": ["沁涼", "溫暖", "粗糙", "滾燙", "黏膩", "微風", "刺痛"]
}


def evaluate_essay(full_text, paragraphs=None, level_name="國中九年級 (會考衝刺)"):
    """
    全方位評估文章，回傳評分、診斷細節與具體改寫建議
    """
    if not full_text or len(full_text.strip()) == 0:
        return None

    clean_text = re.sub(r"\s+", "", full_text)
    total_words = len(clean_text)

    # 取得當前年級標準
    std = LEVEL_WORD_STANDARDS.get(level_name, LEVEL_WORD_STANDARDS["國中九年級 (會考衝刺)"])

    # 1. 篇幅字數評分 (0 ~ 100)
    if total_words < std["min"]:
        length_score = max(30, int((total_words / std["min"]) * 70))
        length_comment = f"⚠️ 篇幅稍顯不足（目前 {total_words} 字，建議至少達到 {std['min']} 字以上）。"
    elif total_words > std["max"] + 200:
        length_score = 85
        length_comment = f"ℹ️ 篇幅略長（目前 {total_words} 字），考場中請注意時間分配與精練度。"
    else:
        length_score = 95
        length_comment = f"✅ 字數標準（目前 {total_words} 字），完美落在該年級建議區間（{std['min']}~{std['max']} 字）！"

    # 2. 段落結構評估
    if paragraphs and isinstance(paragraphs, list):
        valid_paras = [p for p in paragraphs if len(p.strip()) > 0]
        para_count = len(valid_paras)
        para_lengths = [len(re.sub(r"\s+", "", p)) for p in valid_paras]
    else:
        # 依換行切分
        raw_paras = [p.strip() for p in full_text.split("\n") if len(p.strip()) > 0]
        valid_paras = raw_paras
        para_count = len(valid_paras)
        para_lengths = [len(p) for p in valid_paras]

    if para_count < 3:
        structure_score = 65
        structure_comment = "⚠️ 段落偏少，建議至少拆分為『起、承、轉、合』3~4 個完整段落，層次更清晰。"
    elif para_count in [3, 4, 5]:
        structure_score = 92
        structure_comment = f"✅ 段落結構分明（共 {para_count} 段），符合大考起承轉合標準結構！"
    else:
        structure_score = 85
        structure_comment = f"ℹ️ 段落數較多（共 {para_count} 段），請檢查是否有多個單句成段的情況，可適度合併深化。"

    # 3. 修辭手法檢測
    found_rhetorics = []
    rhetoric_score = 70
    for r_name, patterns in RHETORIC_PATTERNS.items():
        hit = False
        for pat in patterns:
            if re.search(pat, full_text):
                hit = True
                break
        if hit:
            found_rhetorics.append(r_name)

    rhetoric_score += len(found_rhetorics) * 6
    rhetoric_score = min(98, rhetoric_score)

    if found_rhetorics:
        rhetoric_comment = f"🌟 捕捉到生動修辭：{', '.join(found_rhetorics)}。讓文字更富感染力！"
    else:
        rhetoric_comment = "💡 建議在文章中加入 1~2 個譬喻句或排比句，文章會瞬間生色不少喔！"

    # 4. 感官摹寫檢測
    found_senses = []
    for sense_name, words in SENSORY_WORDS.items():
        for w in words:
            if w in full_text:
                found_senses.append(sense_name)
                break

    # 5. 標點符號健檢
    punctuation_issues = []
    if "!" in full_text and full_text.count("!") > 5:
        punctuation_issues.append("驚嘆號使用過於頻繁，建議以深沉描摹取代過多感嘆")
    if "," in full_text or "?" in full_text or "!" in full_text:
        punctuation_issues.append("偵測到部分半形標點符號，正式寫作中請統一使用全形標點（，。？！）")
    
    punctuation_score = 95 - len(punctuation_issues) * 10

    # 6. 綜合評分 (0 ~ 100)
    total_overall_score = int(
        length_score * 0.25 + structure_score * 0.25 + rhetoric_score * 0.3 + punctuation_score * 0.2
    )

    # 換算會考級分參考
    if total_overall_score >= 90:
        cap_grade = "6 級分 (立意深遠，文采斐然)"
    elif total_overall_score >= 80:
        cap_grade = "5 級分 (結構完整，條理清晰)"
    elif total_overall_score >= 70:
        cap_grade = "4 級分 (切合題意，基本流暢)"
    elif total_overall_score >= 60:
        cap_grade = "3 級分 (篇幅稍欠，結構待強)"
    else:
        cap_grade = "1~2 級分 (需加強基本句型與題意理解)"

    # 改進建議
    suggestions = []
    if total_words < std["min"]:
        suggestions.append(f"擴充第二段或第三段的事例細節，加入更多動詞與心理活動描寫，讓字數跨過 {std['min']} 字門檻。")
    if not any("譬喻" in r for r in found_rhetorics):
        suggestions.append("試著加入譬喻修辭：把心中的抽象感受（如緊張、喜悅）比喻為具體的大自然事物。")
    if not found_senses:
        suggestions.append("善用五感觀察法：描寫周遭環境的光線（視覺）或聲音（聽覺），營造逼真的臨場感。")
    if punctuation_issues:
        suggestions.extend(punctuation_issues)
    if not suggestions:
        suggestions.append("整體表現極佳！下一步可挑戰在結尾處融入更深層的人生哲理，達到 6 級分頂峰！")

    return {
        "total_words": total_words,
        "overall_score": total_overall_score,
        "cap_grade": cap_grade,
        "radar_data": {
            "維度": ["篇幅完整度", "結構組織力", "文采與修辭", "標點與規範", "情感與立意"],
            "得分": [length_score, structure_score, rhetoric_score, punctuation_score, min(95, total_overall_score + 2)]
        },
        "length_comment": length_comment,
        "structure_comment": structure_comment,
        "rhetoric_comment": rhetoric_comment,
        "found_rhetorics": found_rhetorics,
        "found_senses": list(set(found_senses)),
        "suggestions": suggestions
    }
