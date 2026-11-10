"""
筆墨思潮 (WriteMaster AI) - K-9 分級階梯式寫作教育訓練平台
主應用程式 (Streamlit Web Interface)
"""

import json
import os
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

from news_fetcher import load_local_news_topics, fetch_online_news, convert_news_to_writing_prompt, RSS_SOURCES
from evaluator import evaluate_essay, LEVEL_WORD_STANDARDS

# 設定頁面配置
st.set_page_config(
    page_title="筆墨思潮 (WriteMaster AI) - 階梯寫作訓練平台",
    page_icon="✍️",
    layout="wide",
    initial_sidebar_state="expanded"
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


@st.cache_data
def load_data():
    with open(os.path.join(DATA_DIR, "exam_topics.json"), "r", encoding="utf-8") as f:
        exam_topics = json.load(f)
    with open(os.path.join(DATA_DIR, "writing_guides.json"), "r", encoding="utf-8") as f:
        writing_guides = json.load(f)
    with open(os.path.join(DATA_DIR, "plans.json"), "r", encoding="utf-8") as f:
        plans = json.load(f)
    return exam_topics, writing_guides, plans


exam_topics, writing_guides, plans_data = load_data()

# 初始化 session_state
if "current_topic" not in st.session_state:
    st.session_state.current_topic = "面對青少年的不滿"
if "draft_p1" not in st.session_state:
    st.session_state.draft_p1 = ""
if "draft_p2" not in st.session_state:
    st.session_state.draft_p2 = ""
if "draft_p3" not in st.session_state:
    st.session_state.draft_p3 = ""
if "draft_p4" not in st.session_state:
    st.session_state.draft_p4 = ""
if "checkin_count" not in st.session_state:
    st.session_state.checkin_count = 1

# ================= 側邊欄：身分選擇與導航 =================
with st.sidebar:
    st.title("✍️ 筆墨思潮 WriteMaster")
    st.caption("K-9 分級階梯式寫作智能教育訓練系統")

    st.markdown("---")
    st.subheader("🎓 選擇您的學習身分")
    identity_options = [
        "國小低年級 (1~2年級)",
        "國小中年級 (3~4年級)",
        "國小高年級 (5~6年級)",
        "國中七年級 (國一銜接)",
        "國中八年級 (國二深化)",
        "國中九年級 (會考衝刺)"
    ]
    selected_identity = st.selectbox("當前身分", identity_options, index=5)

    # 顯示該身分的訓練指標
    std = LEVEL_WORD_STANDARDS.get(selected_identity)
    st.info(f"📌 **{selected_identity} 寫作指標**\n\n"
            f"- 建議篇幅：**{std['min']} ~ {std['max']} 字**\n"
            f"- 理想字數：約 **{std['ideal']} 字**")

    st.markdown("---")
    st.markdown("### 🏆 每日學習打卡")
    col_d1, col_d2 = st.columns(2)
    with col_d1:
        st.metric("連續打卡", f"{st.session_state.checkin_count} 天")
    with col_d2:
        if st.button("今日打卡 📅"):
            st.session_state.checkin_count += 1
            st.toast("🎉 打卡成功！今日進步 +1%！")

    st.markdown("---")
    st.caption("版本：v1.0.0 | 本地 Python + Web 架構")

# ================= 主畫面 Tab 標籤切換 =================
tabs = st.tabs([
    "📖 如何寫文章 (技法庫)",
    "📚 歷年經典題庫 (會考/基測)",
    "📅 階梯進步計畫 (30~365天)",
    "📰 時事新聞同步教學",
    "✍️ 互動寫作與智慧診斷室"
])

# ----------------- Tab 1: 如何寫文章 -----------------
with tabs[0]:
    st.header("📖 如何寫文章 — 分階核心寫作秘笈")
    st.markdown("寫作不是天才的專利，而是有跡可循的**邏輯思考與感官重組**。")

    col_g1, col_g2 = st.columns([1, 1])

    with col_g1:
        st.subheader("🔍 審題三步驟法則")
        for m in writing_guides["brainstorm_methods"]:
            if m["name"] == "審題三步驟法則":
                for s in m["steps"]:
                    st.markdown(f"**{s['step']}**：{s['detail']}")

        st.markdown("---")
        st.subheader("👁️ 五感觀察放大鏡 (告別平淡流水帳)")
        for m in writing_guides["brainstorm_methods"]:
            if m["name"] == "五感觀察放大鏡":
                for s in m["steps"]:
                    st.markdown(f"- **{s['sense']}**：{s['tip']}")

    with col_g2:
        st.subheader("🏛️ 起承轉合黃金四段骨架")
        for fw in writing_guides["structure_frameworks"]:
            if "起承轉合" in fw["framework_name"]:
                for p in fw["paragraphs"]:
                    st.markdown(f"**{p['section']}** ({p.get('ratio', '')})\n\n> {p['purpose']}")

    st.markdown("---")
    col_t1, col_t2 = st.columns(2)
    with col_t1:
        st.subheader("🚀 經典破題 5 大法")
        for op in writing_guides["opening_techniques"]:
            with st.expander(f"⭐ {op['name']}"):
                st.write(f"**用法說明**：{op['desc']}")
                st.success(f"**範例示範**：{op['example']}")

    with col_t2:
        st.subheader("🌟 昇華收尾 4 大法")
        for ed in writing_guides["ending_techniques"]:
            with st.expander(f"💎 {ed['name']}"):
                st.write(f"**用法說明**：{ed['desc']}")
                st.info(f"**範例示範**：{ed['example']}")

# ----------------- Tab 2: 歷年題庫 -----------------
with tabs[1]:
    st.header("📚 歷年大考真題與經典題庫庫")
    st.caption("收錄國中會考、歷屆基測與國小經典題，掌握歷年命題脈絡與評分規律。")

    categories = list(set(t["category"] for t in exam_topics))
    c_filter = st.selectbox("篩選題庫類別", ["全部類別"] + categories)

    filtered_topics = [t for t in exam_topics if c_filter == "全部類別" or t["category"] == c_filter]

    for topic in filtered_topics:
        with st.container(border=True):
            col_tp1, col_tp2 = st.columns([3, 1])
            with col_tp1:
                st.markdown(f"### 【{topic.get('year', '經典')}】{topic['title']}")
                st.caption(f"分類：{topic['category']} | 適合階段：{topic['level']} | 文體：{topic.get('prompt_type', '綜合')}")
                st.write(topic["description"])
            with col_tp2:
                if st.button("帶入寫作沙盒 ✍️", key=f"btn_{topic['id']}"):
                    st.session_state.current_topic = topic["title"]
                    st.toast(f"已將題目「{topic['title']}」帶入寫作沙盒！請切換至第 5 個標籤頁。")

            with st.expander("🔎 審題重點、四段引導與金句示範"):
                st.markdown("**🎯 審題與立意核心：**")
                for kp in topic["key_points"]:
                    st.markdown(f"- {kp}")
                st.markdown("**📐 段落佈局建議：**")
                for sg in topic["structure_guide"]:
                    st.markdown(f"- {sg}")
                st.success(f"**💎 高分示範金句**：{topic['sample_golden_sentence']}")

# ----------------- Tab 3: 階梯練習計畫 -----------------
with tabs[2]:
    st.header("📅 階梯式漸進練習計畫 (30 / 60 / 90 / 180 / 365天)")
    st.caption("依循刻意練習原則，從微習慣到篇章大師，一步一腳印見證進步！")

    plan_names = [f"{p['duration']} 天計畫 - {p['name']}" for p in plans_data["plans"]]
    selected_plan_idx = st.selectbox("選擇挑戰天數計畫", range(len(plan_names)), format_func=lambda i: plan_names[i])
    current_plan = plans_data["plans"][selected_plan_idx]

    st.markdown(f"### 🎯 {current_plan['name']}")
    st.info(f"💡 **核心口號**：{current_plan['slogan']}\n\n適合對象：{', '.join(current_plan['suitable_for'])}")

    st.subheader("🪜 階段里程碑拆解 (Phase Roadmap)")
    cols_phase = st.columns(len(current_plan["phase_breakdown"]))
    for i, phase in enumerate(current_plan["phase_breakdown"]):
        with cols_phase[i]:
            with st.container(border=True):
                st.markdown(f"**{phase['days']}**")
                st.markdown(f"**{phase['theme']}**")
                st.caption(phase["goal"])

    st.markdown("---")
    st.subheader("📝 每日示範任務清單")
    for t in current_plan["daily_sample_tasks"]:
        col_t_chk, col_t_txt = st.columns([1, 10])
        with col_t_chk:
            st.checkbox("", key=f"plan_chk_{current_plan['duration']}_{t['day']}")
        with col_t_txt:
            st.markdown(f"**第 {t['day']} 天**：{t['task']}")

# ----------------- Tab 4: 時事新聞同步教學 -----------------
with tabs[3]:
    st.header("📰 即時時事新聞同步教學引擎")
    st.caption("世界正在發生的事，就是最好的寫作素材！訓練孩子由新聞引發反思，發表深刻觀點。")

    col_n1, col_n2 = st.columns([3, 1])
    with col_n1:
        st.write("系統支援**即時網路 RSS 抓取**與**精選時事專案庫**。")
    with col_n2:
        fetch_mode = st.radio("時事來源", ["內建精選時事", "即時線上抓取"], horizontal=True)

    if fetch_mode == "即時線上抓取":
        rss_choice = st.selectbox("選擇 RSS 新聞頻道", list(RSS_SOURCES.keys()))
        news_list = fetch_online_news(RSS_SOURCES[rss_choice])
    else:
        news_list = load_local_news_topics()

    for item in news_list:
        with st.container(border=True):
            st.markdown(f"### 📢 {item['title']}")
            st.caption(f"分類：{item.get('category', '時事焦點')} | 來源：{item.get('source', '新聞網')} | 日期：{item.get('date', '最新')}")
            st.write(item.get("summary", ""))

            # 自動生成時事轉化命題
            derived = convert_news_to_writing_prompt(item["title"], item.get("summary", ""), selected_identity)

            with st.expander("💡 展開【時事轉寫作命題與思辨引導】"):
                st.markdown(f"#### 🎯 推薦寫作題目：《{derived['derived_topic']}》")
                st.markdown("**🤔 思考與提問引導：**")
                for q in derived["guide_questions"]:
                    st.markdown(f"- {q}")
                st.markdown("**📐 建議結構骨架：**")
                for s in derived["structure_tips"]:
                    st.markdown(f"- {s}")

                if st.button("採用此時事題目寫作 ✍️", key=f"news_btn_{item.get('id', item['title'])}"):
                    st.session_state.current_topic = derived["derived_topic"]
                    st.toast(f"已切換題目為《{derived['derived_topic']}》！請至寫作沙盒開始創作。")

# ----------------- Tab 5: 互動寫作與智慧診斷室 -----------------
with tabs[4]:
    st.header("✍️ 互動教學與寫作沙盒")
    st.caption(f"當前身分：【{selected_identity}】 | 題目：《{st.session_state.current_topic}》")

    # 題目修改框
    new_title = st.text_input("寫作題目", value=st.session_state.current_topic)
    if new_title != st.session_state.current_topic:
        st.session_state.current_topic = new_title

    write_mode = st.radio("寫作模式選擇", ["🪜 分段引導模式 (起承轉合一步步來)", "📄 全篇自由寫作模式"], horizontal=True)

    if write_mode == "🪜 分段引導模式 (起承轉合一步步來)":
        col_w1, col_w2 = st.columns(2)
        with col_w1:
            st.subheader("第一段【起】破題立意")
            st.caption("提示：可用『開門見山』或『情境摹寫』，開端吸引讀者。")
            st.session_state.draft_p1 = st.text_area("第一段內容", value=st.session_state.draft_p1, height=120, key="ta_p1")

            st.subheader("第二段【承】事例展開與鋪陳")
            st.caption("提示：具體描寫一次真實經歷或觀察，加入五感與動態細節。")
            st.session_state.draft_p2 = st.text_area("第二段內容", value=st.session_state.draft_p2, height=140, key="ta_p2")

        with col_w2:
            st.subheader("第三段【轉】情感衝突與轉折")
            st.caption("提示：製造情節波瀾！遭遇挫折、不同的聲音、內心糾結與頓悟。")
            st.session_state.draft_p3 = st.text_area("第三段內容", value=st.session_state.draft_p3, height=120, key="ta_p3")

            st.subheader("第四段【合】總結昇華與哲思")
            st.caption("提示：首尾呼應，從小事提煉出人生哲理或前行決心。")
            st.session_state.draft_p4 = st.text_area("第四段內容", value=st.session_state.draft_p4, height=140, key="ta_p4")

        combined_full_text = f"{st.session_state.draft_p1}\n\n{st.session_state.draft_p2}\n\n{st.session_state.draft_p3}\n\n{st.session_state.draft_p4}".strip()
        paragraph_list = [st.session_state.draft_p1, st.session_state.draft_p2, st.session_state.draft_p3, st.session_state.draft_p4]
    else:
        st.subheader("📄 全篇創作區")
        default_combined = f"{st.session_state.draft_p1}\n\n{st.session_state.draft_p2}\n\n{st.session_state.draft_p3}\n\n{st.session_state.draft_p4}".strip()
        free_text = st.text_area("請在此直接撰寫全篇文章", value=default_combined, height=360)
        combined_full_text = free_text.strip()
        paragraph_list = [p for p in free_text.split("\n\n") if p.strip()]

    # 即時快速統計
    current_char_count = len(combined_full_text.replace(" ", "").replace("\n", ""))
    st.markdown(f"**📊 當前累積字數**：`{current_char_count}` 字 | **目標區間**：`{std['min']} ~ {std['max']}` 字")

    st.markdown("---")
    btn_eval = st.button("🚀 開始智能診斷與文章評閱 (Evaluate Essay)", type="primary", use_container_width=True)

    if btn_eval:
        if current_char_count < 10:
            st.warning("⚠️ 請先撰寫至少 10 字以上的文章內容再進行健檢評估喔！")
        else:
            report = evaluate_essay(combined_full_text, paragraph_list, selected_identity)

            st.success("🎉 診斷分析完成！以下為您的專屬寫作評閱報告：")

            col_res1, col_res2 = st.columns([1, 1])

            with col_res1:
                st.metric("整體預測級分", report["cap_grade"])
                st.metric("綜合評分 (滿分 100)", f"{report['overall_score']} 分")

                st.markdown(f"**篇幅檢驗**：{report['length_comment']}")
                st.markdown(f"**結構分析**：{report['structure_comment']}")
                st.markdown(f"**修辭健檢**：{report['rhetoric_comment']}")

                if report["found_senses"]:
                    st.info(f"👁️ 捕捉到的五感描寫：{', '.join(report['found_senses'])}")

            with col_res2:
                # 繪製雷達圖
                df_radar = pd.DataFrame(report["radar_data"])
                fig = go.Figure()
                fig.add_trace(go.Scatterpolar(
                    r=df_radar["得分"],
                    theta=df_radar["維度"],
                    fill='toself',
                    name='得分表現',
                    line_color='#FF4B4B'
                ))
                fig.update_layout(
                    polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                    showlegend=False,
                    title="五維寫作能力雷達分析圖",
                    height=280,
                    margin=dict(l=30, r=30, t=30, b=30)
                )
                st.plotly_chart(fig, use_container_width=True)

            # 具體優化建議
            st.markdown("### 💡 具體升級改寫建議 (Actionable Steps)")
            for idx, sug in enumerate(report["suggestions"], 1):
                st.markdown(f"{idx}. {sug}")

            # 匯出成果
            with st.expander("📥 複製或匯出全文"):
                st.text_area("文章全文", value=combined_full_text, height=200)
                st.download_button(
                    label="下載文章為文字檔 (.txt)",
                    data=f"題目：《{st.session_state.current_topic}》\n身分：{selected_identity}\n\n{combined_full_text}",
                    file_name=f"{st.session_state.current_topic}.txt",
                    mime="text/plain"
                )
