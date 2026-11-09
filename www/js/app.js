// 筆墨思潮 (WriteMaster App) - 行動端主邏輯
document.addEventListener("DOMContentLoaded", () => {
  // DOM 元素引用
  const selectIdentity = document.getElementById("select-identity");
  const badgeWords = document.getElementById("badge-words");
  const streakText = document.getElementById("streak-text");
  const btnStreak = document.getElementById("btn-streak");
  const navItems = document.querySelectorAll(".nav-item");
  const tabContents = document.querySelectorAll(".tab-content");
  const toast = document.getElementById("toast");

  // 寫作沙盒元素
  const studioTopicInput = document.getElementById("studio-topic-input");
  const inputP1 = document.getElementById("input-p1");
  const inputP2 = document.getElementById("input-p2");
  const inputP3 = document.getElementById("input-p3");
  const inputP4 = document.getElementById("input-p4");
  const p1Count = document.getElementById("p1-count");
  const p2Count = document.getElementById("p2-count");
  const p3Count = document.getElementById("p3-count");
  const p4Count = document.getElementById("p4-count");
  const charCounter = document.getElementById("char-counter");
  const btnEvaluate = document.getElementById("btn-evaluate");
  const evalResultCard = document.getElementById("eval-result-card");
  const resGrade = document.getElementById("res-grade");
  const resScore = document.getElementById("res-score");
  const resDetails = document.getElementById("res-details");
  const resSuggestions = document.getElementById("res-suggestions");
  const btnCopyEssay = document.getElementById("btn-copy-essay");

  // 1. 初始化身分選單
  let currentIdentity = localStorage.getItem("wm_identity") || "國中九年級 (會考衝刺)";
  for (const [lvlName, info] of Object.entries(APP_DATA.levelStandards)) {
    const opt = document.createElement("option");
    opt.value = lvlName;
    opt.textContent = lvlName;
    if (lvlName === currentIdentity) opt.selected = true;
    selectIdentity.appendChild(opt);
  }

  function updateIdentityBadge() {
    currentIdentity = selectIdentity.value;
    localStorage.setItem("wm_identity", currentIdentity);
    const info = APP_DATA.levelStandards[currentIdentity];
    if (info) badgeWords.textContent = info.label;
  }
  selectIdentity.addEventListener("change", updateIdentityBadge);
  updateIdentityBadge();

  // 2. 打卡功能
  let streakDays = parseInt(localStorage.getItem("wm_streak") || "1", 10);
  streakText.textContent = `${streakDays}天連續`;
  btnStreak.addEventListener("click", () => {
    streakDays += 1;
    localStorage.setItem("wm_streak", streakDays);
    streakText.textContent = `${streakDays}天連續`;
    showToast(`🎉 今日打卡成功！連續學習第 ${streakDays} 天！`);
  });

  // 3. 標籤頁切換
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetTab = item.dataset.tab;
      navItems.forEach(n => n.classList.remove("active"));
      tabContents.forEach(t => t.classList.remove("active"));
      item.classList.add("active");
      const activeSection = document.getElementById(targetTab);
      if (activeSection) {
        activeSection.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  function switchTab(tabId) {
    navItems.forEach(n => {
      if (n.dataset.tab === tabId) n.classList.add("active");
      else n.classList.remove("active");
    });
    tabContents.forEach(t => {
      if (t.id === tabId) t.classList.add("active");
      else t.classList.remove("active");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 4. 渲染指引 (Guide)
  const guideStepsContainer = document.getElementById("guide-steps-container");
  guideStepsContainer.innerHTML = APP_DATA.writingGuides.steps.map(s => `
    <div style="margin-bottom: 8px; font-size: 0.84rem;">
      <strong style="color: var(--primary);">${s.step}</strong>：${s.desc}
    </div>
  `).join("");

  const guideSensesContainer = document.getElementById("guide-senses-container");
  guideSensesContainer.innerHTML = APP_DATA.writingGuides.senses.map(s => `
    <div style="margin-bottom: 6px; font-size: 0.83rem; line-height: 1.4;">
      <strong>${s.name}</strong>：<span style="color: var(--text-muted);">${s.tip}</span>
    </div>
  `).join("");

  const guideOpenersContainer = document.getElementById("guide-openers-container");
  guideOpenersContainer.innerHTML = `
    <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-bottom: 4px;">破題法：</div>
    ${APP_DATA.writingGuides.openers.map(o => `
      <div style="margin-bottom: 6px; font-size: 0.8rem;">
        <strong>${o.name}</strong>：<em>${o.eg}</em>
      </div>
    `).join("")}
    <div style="font-size: 0.85rem; font-weight: 700; color: #16a34a; margin: 8px 0 4px 0;">昇華結尾法：</div>
    ${APP_DATA.writingGuides.closers.map(c => `
      <div style="margin-bottom: 6px; font-size: 0.8rem;">
        <strong>${c.name}</strong>：<em>${c.eg}</em>
      </div>
    `).join("")}
  `;

  // 5. 渲染題庫 (Topics)
  const topicsContainer = document.getElementById("topics-list-container");
  const selectTopicCat = document.getElementById("select-topic-cat");

  function renderTopics() {
    const filterCat = selectTopicCat.value;
    const filtered = APP_DATA.examTopics.filter(t => filterCat === "ALL" || t.category === filterCat);
    
    topicsContainer.innerHTML = filtered.map(t => `
      <div class="card">
        <div class="card-title">
          <span>【${t.year}】${t.title}</span>
          <span class="tag tag-primary">${t.category}</span>
        </div>
        <div class="card-subtitle">文體：${t.type}</div>
        <div style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px;">
          ${t.desc}
        </div>
        
        <div class="accordion-header" onclick="this.nextElementSibling.classList.toggle('open')">
          <span>🔍 查看審題要點與四段骨架</span>
          <span>▼</span>
        </div>
        <div class="accordion-body">
          <p><strong>🎯 審題核心：</strong></p>
          <ul style="padding-left: 18px; margin-bottom: 8px;">
            ${t.keyPoints.map(k => `<li>${k}</li>`).join("")}
          </ul>
          <p><strong>📐 段落引導：</strong></p>
          <ul style="padding-left: 18px; margin-bottom: 8px;">
            ${t.structure.map(s => `<li>${s}</li>`).join("")}
          </ul>
          <p style="color: #16a34a;"><strong>💎 範例金句：</strong>${t.goldenSentence}</p>
        </div>

        <button class="btn btn-primary btn-sm btn-import-topic" data-title="${t.title}" style="margin-top: 10px;">
          帶入沙盒寫作 ✍️
        </button>
      </div>
    `).join("");

    document.querySelectorAll(".btn-import-topic").forEach(b => {
      b.addEventListener("click", (e) => {
        const title = e.currentTarget.dataset.title;
        studioTopicInput.value = title;
        localStorage.setItem("wm_topic", title);
        switchTab("tab-studio");
        showToast(`已將《${title}》帶入寫作沙盒！`);
      });
    });
  }
  selectTopicCat.addEventListener("change", renderTopics);
  renderTopics();

  // 6. 渲染進步計畫 (Plans)
  const selectPlanDays = document.getElementById("select-plan-days");
  const planTitle = document.getElementById("plan-title");
  const planSubtitle = document.getElementById("plan-subtitle");
  const planStages = document.getElementById("plan-stages");
  const planTasksContainer = document.getElementById("plan-tasks-container");

  APP_DATA.plans.forEach((p, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = `${p.days} 天計畫 - ${p.title}`;
    selectPlanDays.appendChild(opt);
  });

  function renderCurrentPlan() {
    const p = APP_DATA.plans[parseInt(selectPlanDays.value, 10)];
    planTitle.textContent = `${p.days} 天挑戰：${p.title}`;
    planSubtitle.textContent = p.subtitle;

    planStages.innerHTML = p.stages.map(s => `
      <div style="background: #f1f5f9; padding: 6px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 600;">
        📍 ${s}
      </div>
    `).join("");

    planTasksContainer.innerHTML = p.dailyTasks.map((t, idx) => {
      const taskKey = `wm_plan_${p.days}_${idx}`;
      const checked = localStorage.getItem(taskKey) === "1" ? "checked" : "";
      return `
        <div class="task-item">
          <input type="checkbox" id="${taskKey}" ${checked} data-key="${taskKey}">
          <label for="${taskKey}" style="cursor: pointer;">${t}</label>
        </div>
      `;
    }).join("");

    planTasksContainer.querySelectorAll("input[type='checkbox']").forEach(chk => {
      chk.addEventListener("change", (e) => {
        localStorage.setItem(e.target.dataset.key, e.target.checked ? "1" : "0");
        if (e.target.checked) showToast("🎉 完成今日任務！");
      });
    });
  }
  selectPlanDays.addEventListener("change", renderCurrentPlan);
  renderCurrentPlan();

  // 7. 渲染時事新聞 (News)
  const newsContainer = document.getElementById("news-list-container");
  newsContainer.innerHTML = APP_DATA.newsTopics.map(n => `
    <div class="card">
      <div class="card-title">
        <span>📢 ${n.title}</span>
        <span class="tag tag-primary">${n.tag}</span>
      </div>
      <div style="font-size: 0.83rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 8px;">
        ${n.summary}
      </div>
      <div style="background: #fef2f2; border: 1px solid #fee2e2; padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: #991b1b; margin-bottom: 10px; line-height: 1.4;">
        <strong>爭點思辨：</strong>${n.debate}
      </div>

      <div class="accordion-header" onclick="this.nextElementSibling.classList.toggle('open')">
        <span>💡 查看適合本年級的命題與引導</span>
        <span>▼</span>
      </div>
      <div class="accordion-body">
        <p><strong>國小推薦題：</strong>${n.promptElementary}</p>
        <p style="margin-top: 6px;"><strong>國中推薦題：</strong>${n.promptJunior}</p>
      </div>

      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button class="btn btn-outline btn-sm btn-news-elem" data-topic="${n.promptElementary.split(' (')[0]}">帶入國小題</button>
        <button class="btn btn-primary btn-sm btn-news-jun" data-topic="${n.promptJunior.split(' (')[0]}">帶入國中題</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".btn-news-elem, .btn-news-jun").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const topic = e.currentTarget.dataset.topic;
      studioTopicInput.value = topic;
      localStorage.setItem("wm_topic", topic);
      switchTab("tab-studio");
      showToast(`已帶入時事題目《${topic}》！`);
    });
  });

  // 8. 寫作沙盒字數統計與草稿儲存
  studioTopicInput.value = localStorage.getItem("wm_topic") || "面對青少年的不滿";
  inputP1.value = localStorage.getItem("wm_draft_p1") || "";
  inputP2.value = localStorage.getItem("wm_draft_p2") || "";
  inputP3.value = localStorage.getItem("wm_draft_p3") || "";
  inputP4.value = localStorage.getItem("wm_draft_p4") || "";

  function updateCharCounts() {
    const c1 = inputP1.value.replace(/\s+/g, '').length;
    const c2 = inputP2.value.replace(/\s+/g, '').length;
    const c3 = inputP3.value.replace(/\s+/g, '').length;
    const c4 = inputP4.value.replace(/\s+/g, '').length;
    const total = c1 + c2 + c3 + c4;

    p1Count.textContent = `${c1}字`;
    p2Count.textContent = `${c2}字`;
    p3Count.textContent = `${c3}字`;
    p4Count.textContent = `${c4}字`;
    charCounter.textContent = `累積 ${total} 字`;

    localStorage.setItem("wm_draft_p1", inputP1.value);
    localStorage.setItem("wm_draft_p2", inputP2.value);
    localStorage.setItem("wm_draft_p3", inputP3.value);
    localStorage.setItem("wm_draft_p4", inputP4.value);
    localStorage.setItem("wm_topic", studioTopicInput.value);
  }

  [inputP1, inputP2, inputP3, inputP4, studioTopicInput].forEach(el => {
    el.addEventListener("input", updateCharCounts);
  });
  updateCharCounts();

  // 9. 智能診斷分析
  btnEvaluate.addEventListener("click", () => {
    const fullText = [inputP1.value, inputP2.value, inputP3.value, inputP4.value].join("\n\n").trim();
    const cleanLen = fullText.replace(/\s+/g, '').length;

    if (cleanLen < 15) {
      showToast("⚠️ 請先撰寫至少 15 字以上內容再進行診斷喔！");
      return;
    }

    const report = Evaluator.evaluate(fullText, [inputP1.value, inputP2.value, inputP3.value, inputP4.value], currentIdentity);
    if (!report) return;

    resGrade.textContent = report.capGrade;
    resScore.textContent = `${report.overallScore} 分`;

    resDetails.innerHTML = `
      <p>• <strong>篇幅診斷</strong>：${report.lengthComment}</p>
      <p>• <strong>結構層次</strong>：${report.structComment}</p>
      <p>• <strong>修辭檢測</strong>：${report.rhetoricComment}</p>
      ${report.foundSenses.length > 0 ? `<p>• <strong>五感描摹</strong>：已運用 ${report.foundSenses.join('、')}</p>` : ''}
    `;

    resSuggestions.innerHTML = report.suggestions.map(s => `<li>${s}</li>`).join("");

    drawRadarChart(report.dimensions.labels, report.dimensions.scores);

    evalResultCard.style.display = "block";
    evalResultCard.scrollIntoView({ behavior: "smooth" });
    showToast("🎉 評閱報告生成完畢！");
  });

  // 10. Canvas 輕量五維雷達圖繪製
  function drawRadarChart(labels, values) {
    const canvas = document.getElementById("radar-canvas");
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = 80;
    const numPoints = labels.length;
    const angleStep = (Math.PI * 2) / numPoints;

    ctx.clearRect(0, 0, w, h);

    // 繪製多層同心多邊形網格
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let level = 1; level <= 4; level++) {
      const r = (radius / 4) * level;
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 繪製放射軸與標籤文字
    ctx.fillStyle = "#475569";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      const labelX = cx + (radius + 20) * Math.cos(angle);
      const labelY = cy + (radius + 16) * Math.sin(angle);
      ctx.fillText(labels[i], labelX, labelY);
    }

    // 繪製數據多邊形
    ctx.beginPath();
    ctx.fillStyle = "rgba(79, 70, 229, 0.25)";
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2.5;

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const valRatio = Math.max(0.1, Math.min(1.0, values[i] / 100));
      const r = radius * valRatio;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 繪製數據節點
    ctx.fillStyle = "#4f46e5";
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const valRatio = Math.max(0.1, Math.min(1.0, values[i] / 100));
      const r = radius * valRatio;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 11. 複製全文按鈕
  btnCopyEssay.addEventListener("click", () => {
    const title = studioTopicInput.value || "未命名";
    const fullText = [inputP1.value, inputP2.value, inputP3.value, inputP4.value].join("\n\n").trim();
    const content = `【題目】《${title}》\n【身分】${currentIdentity}\n\n${fullText}\n\n[評估結果] ${resGrade.textContent} (${resScore.textContent})`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(content).then(() => {
        showToast("📋 全文與評分已成功複製至剪貼簿！");
      }).catch(() => {
        showToast("⚠️ 複製失敗，請手動選取文字。");
      });
    } else {
      showToast("📋 已產出文章，請長按選取複製。");
    }
  });

  // Toast 函式
  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 2500);
  }

  // 12. PWA 安裝提示關閉與記錄
  const pwaBanner = document.getElementById("pwa-install-banner");
  const closeBanner = document.getElementById("close-banner");
  if (closeBanner && pwaBanner) {
    if (localStorage.getItem("wm_hide_pwa_banner") === "1") {
      pwaBanner.style.display = "none";
    }
    closeBanner.addEventListener("click", () => {
      pwaBanner.style.display = "none";
      localStorage.setItem("wm_hide_pwa_banner", "1");
    });
  }

  // 13. 註冊 Service Worker (離線快取支援)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('ServiceWorker registered:', reg.scope);
      }).catch((err) => {
        console.log('ServiceWorker registration failed:', err);
      });
    });
  }
});
