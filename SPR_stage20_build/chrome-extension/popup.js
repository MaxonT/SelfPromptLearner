// popup.js

// 1. 核心分类逻辑 (JS版)
const CATEGORIES = {
  "💻 编程": ["代码", "code", "函数", "报错", "bug", "python", "js", "react", "sql", "api", "写一个", "实现"],
  "📝 创作": ["文案", "文章", "周报", "总结", "扩写", "润色", "大纲", "标题", "翻译", "邮件"],
  "🧠 逻辑": ["分析", "原因", "区别", "比较", "评价", "优缺点", "建议", "方案", "思维导图"],
  "🎓 学习": ["解释", "介绍", "是什么", "含义", "原理", "教程", "学习", "如何"],
  "🎨 创意": ["创意", "点子", "故事", "设想", "如果", "生成", "设计"]
};

const classify = (text) => {
  text = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(k => text.includes(k))) return cat;
  }
  return "📂 其他";
};

// 2. 状态管理
let currentChart = null;
let currentTab = 'radar';
let allPrompts = [];

// 3. 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderKPI();
  renderList();
  renderChart();

  // 绑定事件
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });
  
  document.getElementById('scan-btn').onclick = handleScan;
  document.getElementById('export-btn').onclick = handleExport;
});

// --- 数据加载 ---
async function loadData() {
  const { prompts } = await chrome.storage.local.get('prompts');
  allPrompts = (prompts || []).sort((a, b) => b.ts - a.ts);
}

// --- 渲染 KPI ---
function renderKPI() {
  const today = new Date().toDateString();
  const todayCount = allPrompts.filter(p => new Date(p.ts).toDateString() === today).length;
  
  animateValue("today-count", 0, todayCount, 800);
  animateValue("total-count", 0, allPrompts.length, 800);
}

// --- 渲染列表 ---
function renderList() {
  const listEl = document.getElementById('recent-list');
  if (allPrompts.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👻</div>
        <div>还没有数据，快去 ChatGPT 页面点击扫描吧！</div>
      </div>`;
    return;
  }

  listEl.innerHTML = allPrompts.slice(0, 5).map(p => {
    const cat = classify(p.text);
    const date = new Date(p.ts);
    const timeStr = date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0');
    return `
      <div class="prompt-item">
        <div class="prompt-text">${escapeHtml(p.text)}</div>
        <div class="prompt-meta">
          <span class="tag">${cat}</span>
          <span>${timeStr}</span>
        </div>
      </div>
    `;
  }).join('');
}

// --- 渲染图表 ---
function renderChart() {
  const ctx = document.getElementById('mainChart').getContext('2d');
  if (currentChart) currentChart.destroy();

  // 统计数据
  const stats = {};
  Object.keys(CATEGORIES).forEach(k => stats[k] = 0);
  stats["📂 其他"] = 0;
  
  allPrompts.forEach(p => {
    const cat = classify(p.text);
    stats[cat] = (stats[cat] || 0) + 1;
  });

  const labels = Object.keys(stats).filter(k => k !== "📂 其他"); // 雷达图不显示其他
  const data = labels.map(k => stats[k]);

  // Chart.js 配置
  const config = {
    type: currentTab === 'radar' ? 'radar' : 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Prompt 分布',
        data: data,
        backgroundColor: currentTab === 'radar' 
          ? 'rgba(58, 134, 255, 0.2)' 
          : ['#3a86ff', '#8338ec', '#ff006e', '#fb5607', '#ffbe0b'],
        borderColor: '#3a86ff',
        borderWidth: 2,
        pointBackgroundColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: currentTab !== 'radar', position: 'right' }
      },
      scales: currentTab === 'radar' ? {
        r: {
          beginAtZero: true,
          ticks: { display: false },
          pointLabels: { font: { size: 12 } }
        }
      } : {}
    }
  };

  currentChart = new Chart(ctx, config);
}

// --- 交互逻辑 ---
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => 
    b.classList.toggle('active', b.dataset.tab === tab)
  );
  renderChart();
}

async function handleScan() {
  const btn = document.getElementById('scan-btn');
  btn.classList.add('scanning');
  
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab?.url || (!tab.url.includes("openai.com") && !tab.url.includes("chatgpt.com"))) {
    btn.classList.remove('scanning');
    alert("请在 ChatGPT 页面使用");
    return;
  }

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => [...document.querySelectorAll('[data-message-author-role="user"]')]
                 .map(d => d.innerText.trim()).filter(t => t)
  }, async (results) => {
    btn.classList.remove('scanning');
    const texts = results[0]?.result || [];
    if (texts.length) {
      // 存入 (复用之前的逻辑)
      const { prompts = [] } = await chrome.storage.local.get("prompts");
      const existing = new Set(prompts.map(p => p.text));
      let added = 0;
      texts.forEach(t => {
        if (!existing.has(t)) {
          prompts.push({ ts: Date.now(), text: t, src: "scan" });
          existing.add(t);
          added++;
        }
      });
      await chrome.storage.local.set({ prompts });
      
      // 刷新界面
      await loadData();
      renderKPI();
      renderList();
      renderChart();
    } else {
      alert("没找到 Prompt，请滚动页面加载更多");
    }
  });
}

function handleExport() {
  const json = JSON.stringify(allPrompts, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'my_prompts.json'; a.click();
}

// --- 工具函数 ---
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function animateValue(id, start, end, duration) {
  if (start === end) return;
  const range = end - start;
  const obj = document.getElementById(id);
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    obj.innerHTML = Math.floor(progress * range + start);
    if (progress < 1) window.requestAnimationFrame(step);
    else obj.innerHTML = end;
  };
  window.requestAnimationFrame(step);
}