// popup.js

// 1. Core Logic
const CATEGORIES = {
  "🎓 Learning": [
    "explain", "what", "how", "meaning", "tutorial", "learn", "concept", "diff", "analyze", "guide", "teach", "lesson", "course", "study", "exam", "test", "quiz", "question", "answer", "solution", "definition", "define", "term", "vocabulary", "grammar", "history", "science", "math", "physics", "chemistry", "biology", "art", "music", "culture", "language", "skill", "tip", "trick", "hack", "advice", "suggestion", "recommendation", "resource", "book", "paper", "article", "video", "podcast", "tool", "software", "app", "roadmap", "curriculum", "syllabus", "beginner", "advanced", "expert", "master", "basics", "fundamentals", "overview", "intro", "background", "context", "origin", "evolution", "trend", "future", "insight", "knowledge", "wisdom", "experience",
    "解释", "介绍", "是什么", "含义", "原理", "教程", "学习", "如何", "概念", "区别", "对比", "分析", "指导", "教学", "课程", "讲座", "研究", "考试", "测试", "测验", "问题", "答案", "解决方案", "定义", "术语", "词汇", "语法", "历史", "科学", "数学", "物理", "化学", "生物", "艺术", "音乐", "文化", "语言", "技能", "技巧", "建议", "推荐", "资源", "书籍", "论文", "文章", "视频", "播客", "工具", "软件", "应用", "路线图", "大纲", "入门", "进阶", "专家", "大师", "基础", "概览", "背景", "起源", "演变", "趋势", "未来", "洞察", "知识", "智慧", "经验"
  ],
  "💻 Coding": [
    "code", "function", "error", "implement", "debug", "optimize", "refactor", "bug", "fix", "issue", "crash", "stacktrace", "deploy", "build", "run", "script", "algorithm", "loop", "variable", "import", "package", "install", "pip", "npm", "yarn", "compile", "exception", "try", "catch", "async", "await", "promise", "thread", "process", "linux", "shell", "bash", "terminal", "ci/cd", "pipeline", "jenkins", "azure", "gcp", "aws", "docker", "k8s", "git", "github", "merge", "branch", "commit", "database", "db", "mongo", "redis", "query", "request", "response", "json", "xml", "yaml", "config", "server", "client", "frontend", "backend", "fullstack", "devops", "sre", "test", "selenium", "cypress", "playwright", "jest", "mocha", "typescript", "ts", "react", "vue", "angular", "svelte", "nextjs", "nuxtjs", "node", "python", "java", "go", "rust", "c++", "c#", "php", "ruby", "swift", "kotlin", "scala", "dart", "r", "perl", "lua", "haskell", "clojure", "elixir", "erlang", "f#", "ocaml", "racket", "scheme", "lisp", "prolog", "assembly", "wasm", "sql", "nosql", "rest", "graphql", "grpc", "websocket", "socket", "tcp", "udp", "http", "https", "ssl", "tls", "certificate", "key", "token", "auth", "jwt", "oauth", "sso", "ldap", "encryption", "hashing", "salt", "uuid", "guid", "regex", "regular expression",
    "代码", "函数", "报错", "bug", "python", "js", "react", "sql", "api", "写一个", "实现", "调试", "优化", "重构", "修复", "问题", "崩溃", "堆栈", "部署", "构建", "运行", "脚本", "算法", "循环", "变量", "导入", "包", "安装", "编译", "异常", "异步", "等待", "承诺", "线程", "进程", "终端", "流水线", "容器", "数据库", "查询", "请求", "响应", "配置", "服务器", "客户端", "前端", "后端", "全栈", "运维", "测试", "框架", "库", "接口", "协议", "加密", "解密", "正则", "表达式"
  ],
  "📝 Writing": [
    "write", "article", "report", "summary", "expand", "polish", "outline", "title", "translate", "email", "rewrite", "essay", "blog", "post", "copy", "copywriting", "intro", "conclusion", "paragraph", "sentence", "grammar", "spelling", "tone", "style", "formal", "casual", "academic", "professional", "revise", "edit", "proofread", "check", "draft", "memo", "letter", "proposal", "statement", "bio", "description", "caption", "slogan", "tagline", "keyword", "seo", "story", "narrative", "plot", "character", "dialogue", "script", "screenplay", "poem", "lyrics", "rhyme", "verse", "paraphrase", "rephrase", "word", "wording", "vocabulary", "synonym", "antonym", "definition", "meaning", "context", "nuance", "clarity", "concise", "coherent", "flow", "structure", "organize", "format", "layout", "design", "visual", "image", "picture", "headline", "subheading", "bullet", "list", "table", "chart", "graph", "diagram", "figure", "illustration", "example", "sample", "template", "pattern", "model", "framework", "guide", "manual", "handbook",
    "文案", "文章", "周报", "总结", "扩写", "润色", "大纲", "标题", "翻译", "邮件", "改写", "作文", "博客", "帖子", "简介", "结论", "段落", "句子", "语法", "拼写", "语气", "风格", "正式", "随意", "学术", "专业", "修改", "编辑", "校对", "检查", "草稿", "备忘录", "信件", "提案", "声明", "简历", "描述", "说明", "口号", "标语", "关键词", "故事", "叙事", "情节", "角色", "对话", "剧本", "诗歌", "歌词", "韵脚", "诗句", "措辞", "词汇", "同义词", "反义词", "定义", "含义", "语境", "清晰", "简洁", "连贯", "流畅", "结构", "组织", "格式", "布局", "设计", "视觉", "图片", "图表", "图解", "示例", "样本", "模板", "模型", "框架", "指南", "手册"
  ],
  "🧠 Logic": [
    "reason", "evaluate", "pros", "cons", "suggest", "plan", "mindmap", "process", "logic", "critique", "analyze", "compare", "difference", "strategy", "tactic", "method", "approach", "framework", "model", "theory", "hypothesis", "assumption", "premise", "conclusion", "argument", "debate", "review", "assess", "audit", "investigate", "research", "study", "survey", "data", "evidence", "proof", "logical", "fallacy", "bias", "cognitive", "psychology", "philosophy", "ethics", "moral", "value", "principle", "rule", "law", "regulation", "policy", "guideline", "standard", "criteria", "metric", "kpi", "okr", "goal", "objective", "why", "how", "cause", "effect", "impact", "consequence", "result", "outcome", "implication", "significance", "relevance", "step by step", "procedure", "workflow", "system", "structure", "hierarchy", "relationship", "connection", "link", "pattern", "trend", "cycle", "loop", "feedback", "input", "output", "bottleneck", "constraint", "limitation", "challenge", "opportunity", "threat", "strength", "weakness", "swot", "pest", "pestle", "smart", "roi", "cost", "benefit", "trade-off",
    "原因", "评价", "优缺点", "建议", "方案", "思维导图", "流程", "推演", "逻辑", "批判", "分析", "比较", "区别", "策略", "战术", "方法", "途径", "框架", "模型", "理论", "假设", "前提", "结论", "论点", "辩论", "审查", "评估", "审计", "调查", "研究", "学习", "数据", "证据", "证明", "谬误", "偏见", "认知", "心理", "哲学", "伦理", "道德", "价值", "原则", "规则", "法律", "法规", "政策", "指南", "标准", "指标", "目标", "目的", "因果", "影响", "后果", "结果", "意义", "相关性", "步骤", "程序", "工作流", "系统", "结构", "层级", "关系", "连接", "模式", "趋势", "循环", "反馈", "输入", "输出", "瓶颈", "约束", "限制", "挑战", "机会", "威胁", "优势", "劣势", "成本", "效益", "权衡"
  ],
  "🎨 Creative": [
    "idea", "story", "imagine", "if", "generate", "design", "color", "inspiration", "brainstorm", "create", "concept", "vision", "dream", "fantasy", "fiction", "novel", "game", "play", "fun", "joke", "humor", "comedy", "satire", "parody", "meme", "logo", "icon", "image", "picture", "photo", "video", "audio", "music", "song", "sound", "palette", "font", "typography", "layout", "ui", "ux", "wireframe", "prototype", "mockup", "sketch", "drawing", "painting", "character", "role", "persona", "profile", "background", "backstory", "plot", "setting", "scene", "dialogue", "script", "screenplay", "poem", "haiku", "limerick", "sonnet", "lyrics", "verse", "rhyme", "rhythm", "melody", "harmony", "chord", "scale", "key", "style", "genre", "mood", "atmosphere", "vibe", "tone", "voice", "narrator", "perspective", "viewpoint", "theme", "motif", "symbol", "metaphor", "simile", "analogy", "allegory", "fable", "myth", "legend", "folklore", "fairy tale", "sci-fi",
    "创意", "点子", "故事", "设想", "如果", "生成", "设计", "配色", "灵感", "脑暴", "创造", "概念", "愿景", "梦想", "幻想", "小说", "游戏", "玩", "有趣", "笑话", "幽默", "喜剧", "讽刺", "恶搞", "梗", "图标", "图片", "照片", "视频", "音频", "音乐", "歌曲", "声音", "调色板", "字体", "排版", "布局", "界面", "体验", "线框图", "原型", "样机", "草图", "绘画", "角色", "人设", "背景", "情节", "场景", "对话", "剧本", "诗歌", "歌词", "韵律", "节奏", "旋律", "和声", "和弦", "音阶", "调式", "风格", "流派", "情绪", "氛围", "基调", "声音", "叙述者", "视角", "观点", "主题", "母题", "象征", "隐喻", "明喻", "类比", "寓言", "神话", "传说", "民间故事", "童话", "科幻"
  ]
};

const classify = (text) => {
  text = text.toLowerCase();
  if (CATEGORIES["🎓 Learning"].some(k => text.includes(k)) && !text.includes("代码") && !text.includes("code")) return "🎓 Learning";
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(k => text.includes(k))) return cat;
  }
  return "📂 Other";
};

// 2. State
let currentChart = null;
let currentTab = 'radar';
let allPrompts = [];
let currentLang = 'en';

const I18N = {
  en: {
    today: "Today",
    total: "Total Prompts",
    radar: "Skill Radar",
    pie: "Type Dist.",
    recent: "Recent",
    scan: "Scan Page",
    export: "Export Data",
    empty: "No prompts yet...",
    clickScan: "Click scan icon to start",
    other: "📂 Other",
    manage: "Manage Data",
    privacy: "Privacy Policy",
    clearAll: "Clear All",
    back: "← Back",
    confirmClear: "Are you sure you want to delete ALL data? This cannot be undone.",
    cleared: "All data cleared."
  },
  zh: {
    today: "今日收集",
    total: "总计 Prompt",
    radar: "能力雷达",
    pie: "类型分布",
    recent: "最近记录",
    scan: "扫描页面",
    export: "导出数据",
    empty: "还没有数据...",
    clickScan: "点击右上角扫描",
    other: "📂 其他",
    manage: "管理数据",
    privacy: "隐私政策",
    clearAll: "清空所有",
    back: "← 返回",
    confirmClear: "确定要清空所有数据吗？此操作无法撤销。",
    cleared: "数据已清空。"
  }
};

// 3. Init
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Bind Events first (so UI is responsive even if data/charts fail)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });
  
  document.getElementById('scan-btn').onclick = handleScan;
  document.getElementById('export-btn').onclick = handleExport;
  document.getElementById('lang-btn').onclick = toggleLang;
  document.getElementById('theme-btn').onclick = toggleTheme;
  document.getElementById('main-site-btn').onclick = () => {
    chrome.tabs.create({ url: `https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/?lang=${currentLang}` });
  };
  
  // Manage Data Views
  document.getElementById('manage-btn').onclick = showManageView;
  document.getElementById('back-btn').onclick = showDashboardView;
  document.getElementById('clear-all-btn').onclick = handleClearAll;
  document.getElementById('privacy-link').onclick = (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'privacy.html' });
  };

  // 2. Load Data & Init UI
  await loadData();
  
  const savedLang = localStorage.getItem('lang');
  if (savedLang) currentLang = savedLang;
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) currentTheme = savedTheme;
  updateThemeUI(); // Ensure theme is applied immediately

  updateLangUI();
  
  renderKPI();
  renderList();
  try {
    renderChart();
  } catch (e) {
    console.error("Chart render failed:", e);
  }
});

// --- View Switching ---
function showManageView() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('manage-view').style.display = 'block';
    renderManageList();
}

function showDashboardView() {
    document.getElementById('manage-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    // Refresh main view in case of deletions
    renderKPI();
    renderList();
    renderChart();
}

// --- Manage Data Logic ---
function renderManageList() {
    const list = document.getElementById('manage-list');
    list.innerHTML = allPrompts.map((p, i) => `
        <div class="manage-item">
            <div class="manage-text" title="${escapeHtml(p.text)}">${escapeHtml(p.text)}</div>
            <div class="delete-icon" onclick="deleteItem(${i})">🗑️</div>
        </div>
    `).join('');
    
    // Add event listeners for delete icons
    document.querySelectorAll('.delete-icon').forEach((icon, index) => {
        icon.onclick = () => deleteItem(index);
    });
}

async function deleteItem(index) {
    allPrompts.splice(index, 1);
    await chrome.storage.local.set({ prompts: allPrompts });
    renderManageList(); // Re-render manage list
}

async function handleClearAll() {
    const t = I18N[currentLang];
    if (confirm(t.confirmClear)) {
        allPrompts = [];
        await chrome.storage.local.set({ prompts: [] });
        renderManageList();
        alert(t.cleared);
    }
}

// --- Other Logic ---
function toggleLang() {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  localStorage.setItem('lang', currentLang);
  updateLangUI();
  renderKPI();
  renderList();
  renderChart();
  renderManageList();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    updateThemeUI();
    renderChart(); // Re-render chart to update colors
}

function updateThemeUI() {
    const btn = document.getElementById('theme-btn');
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        btn.innerText = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        btn.innerText = '🌙';
    }
}

function updateLangUI() {
  const t = I18N[currentLang];
  document.getElementById('lang-btn').innerText = currentLang === 'en' ? 'EN' : 'CN';
  
  document.querySelector('.kpi-card:nth-child(1) .kpi-label').innerText = t.today;
  document.querySelector('.kpi-card:nth-child(2) .kpi-label').innerText = t.total;
  document.querySelector('.tab-btn[data-tab="radar"]').innerText = t.radar;
  document.querySelector('.tab-btn[data-tab="pie"]').innerText = t.pie;
  document.querySelector('.list-header h2').innerText = t.recent;
  
  document.getElementById('scan-btn').title = t.scan;
  document.getElementById('export-btn').title = t.export;
  
  document.getElementById('manage-btn').innerText = t.manage;
  document.getElementById('privacy-link').innerText = t.privacy;
  document.getElementById('clear-all-btn').innerText = t.clearAll;
  document.getElementById('back-btn').innerText = t.back;
}

async function loadData() {
  const { prompts } = await chrome.storage.local.get('prompts');
  allPrompts = (prompts || []).sort((a, b) => b.ts - a.ts);
}

function renderKPI() {
  const today = new Date().toDateString();
  const todayCount = allPrompts.filter(p => new Date(p.ts).toDateString() === today).length;
  document.getElementById('today-count').innerText = todayCount;
  document.getElementById('total-count').innerText = allPrompts.length;
}

function renderList() {
  const listEl = document.getElementById('recent-list');
  if (allPrompts.length === 0) {
    listEl.innerHTML = `<div style="text-align:center; padding:20px; color:#666;">${I18N[currentLang].empty}</div>`;
    return;
  }

  listEl.innerHTML = allPrompts.slice(0, 5).map((p) => {
    const cat = classify(p.text);
    return `
      <div class="prompt-item">
        <div class="prompt-text">${escapeHtml(p.text)}</div>
        <div class="prompt-meta">
          <span class="tag">${cat}</span>
          <span>${new Date(p.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderChart() {
  const ctx = document.getElementById('mainChart').getContext('2d');
  if (currentChart) currentChart.destroy();

  const stats = {};
  // Translation mapping... simplified for brevity, assuming standard categories
  const cats = Object.keys(CATEGORIES);
  cats.push("📂 Other");
  cats.forEach(c => stats[c] = 0);
  
  allPrompts.forEach(p => {
    const c = classify(p.text);
    stats[c] = (stats[c] || 0) + 1;
  });

  const labels = Object.keys(stats);
  const data = Object.values(stats);

  const isLight = currentTheme === 'light';
  const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
  const textColor = isLight ? '#1e293b' : '#cbd5e1';

  currentChart = new Chart(ctx, {
    type: currentTab === 'radar' ? 'radar' : 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Prompts',
        data: data,
        backgroundColor: currentTab === 'radar' ? 'rgba(212, 175, 55, 0.2)' : ['#D4AF37', '#3a86ff', '#8338ec', '#ff006e', '#fb5607', '#999'],
        borderColor: '#D4AF37',
        borderWidth: 1,
        pointBackgroundColor: isLight ? '#fff' : '#0f172a',
        pointBorderColor: '#D4AF37'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: currentTab === 'radar' ? {
        r: {
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: { color: textColor, font: {size: 10} },
            ticks: { display: false, backdropColor: 'transparent' }
        }
      } : {
          // Hide axes for doughnut
      },
      plugins: {
          legend: { 
              display: currentTab !== 'radar',
              position: 'right',
              labels: { color: textColor, boxWidth: 10, font: {size: 10} }
          }
      }
    }
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  renderChart();
}

async function handleScan() {
  const btn = document.getElementById('scan-btn');
  btn.style.color = '#D4AF37'; // Active state
  
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab) return;

  // Robust Injection Function
  function scanPage() {
    const host = window.location.hostname;
    let selectors = [];
    if (host.includes('claude')) selectors = ['.font-user-message', '[data-test-id="user-message"]'];
    else if (host.includes('gemini')) selectors = ['user-query', '[data-message-author-role="user"]'];
    else selectors = ['[data-message-author-role="user"]', '.request-data', '[data-role="user"]'];
    
    let texts = [];
    for (const sel of selectors) {
        const els = document.querySelectorAll(sel);
        if (els.length) { texts = [...els].map(e => e.innerText.trim()); break; }
    }
    // Fallback
    if (!texts.length) {
         const userDivs = [...document.querySelectorAll('div[aria-label="User"], div[aria-label="You"]')];
         if (userDivs.length) texts = userDivs.map(d => d.innerText.trim());
    }
    return texts.filter(t => t && t.length > 1);
  }

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: scanPage
  }, async (results) => {
    btn.style.color = ''; // Reset
    const texts = results?.[0]?.result || [];
    if (texts.length) {
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
      loadData().then(() => {
          renderKPI();
          renderList();
          renderChart();
      });
    } else {
      alert(currentLang === 'en' ? "No prompts found on this page." : "未找到 Prompt，请尝试滚动页面。");
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

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
