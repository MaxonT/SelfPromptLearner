import streamlit as st
import pandas as pd
import jieba
import re
import json
import numpy as np
import nltk
from wordcloud import WordCloud
from collections import Counter
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
import streamlit.components.v1 as components
import textwrap

# --- Session State Management (Persistence) ---
if 'lang' not in st.session_state:
    # Check query params for initial language
    qp = st.query_params
    st.session_state.lang = qp.get('lang', 'en') # Default English

# FORCE LUXURY DARK MODE (Remove 'theme' toggle logic)
st.session_state.theme = 'dark'

# Persist DataFrames across reruns
if 'cached_data' not in st.session_state:
    st.session_state.cached_data = None

# --- Translations Dictionary ---
TRANSLATIONS = {
    'page_title': {
        'en': "SPR - Mind Cockpit",
        'zh': "SPR - 全能思维驾驶舱"
    },
    'page_caption': {
        'en': "🚀 From Quantity to Quality: Visualize Your Thinking Patterns & Evolution",
        'zh': "🚀 From Quantity to Quality: 洞察你的思维模式与进化路径"
    },
    'upload_header': {
        'en': "📤 Data Center",
        'zh': "📤 数据中心"
    },
    'upload_info': {
        'en': "Support `my_prompts.json` from Chrome Extension",
        'zh': "支持 Chrome 插件导出的 `my_prompts.json`"
    },
    'upload_label': {
        'en': "Import Data",
        'zh': "导入数据"
    },
    'settings_header': {
        'en': "⚙️ Preferences",
        'zh': "⚙️ 偏好设置"
    },
    'filter_short': {
        'en': "Filter short prompts (<5 chars)",
        'zh': "过滤短 Prompt (<5字)"
    },
    'privacy_header': {
        'en': "### Privacy Note",
        'zh': "### 隐私说明"
    },
    'privacy_caption': {
        'en': "🔒 All calculations are done locally. No data uploaded.",
        'zh': "🔒 所有计算均在本地完成，数据不上传云端。"
    },
    'upload_error': {
        'en': "Data parsing failed: {}",
        'zh': "数据解析失败: {}"
    },
    'upload_hint': {
        'en': "👈 Please upload data file on the left",
        'zh': "👈 请先在左侧上传数据文件"
    },
    'tab_manage': {
        'en': "🗂️ Data Manager",
        'zh': "🗂️ 数据管理"
    },
    'manage_header': {
        'en': "Data Management",
        'zh': "数据管理中心"
    },
    'delete_btn': {
        'en': "Delete Selected",
        'zh': "删除选中项"
    },
    'privacy_title': {
        'en': "🔒 Privacy & Legal",
        'zh': "🔒 隐私与法律声明"
    },
    'privacy_content': {
        'en': """
        **Local Processing Only**
        Your data never leaves your browser/local machine. All analysis is performed locally using Python.
        
        **Open Source**
        This tool is open source under MIT License. You have full control over your data.
        """,
        'zh': """
        **纯本地处理**
        您的数据永远不会离开您的浏览器或本地机器。所有分析均使用 Python 在本地完成。
        
        **开源透明**
        本工具基于 MIT 协议开源。您拥有对数据的完全控制权。
        """
    },
    'filter_strict': {
        'en': "Strict Filter (Remove generic/junk)",
        'zh': "严格过滤 (移除通用/垃圾 Prompt)"
    },
    'overview_header': {
        'en': "📊 Core Metrics",
        'zh': "📊 核心指标 (Overview)"
    },
    'metric_total': {
        'en': "Total Prompts",
        'zh': "累计 Prompt"
    },
    'metric_vocab': {
        'en': "Vocabulary Size",
        'zh': "思维词汇量"
    },
    'metric_avg_len': {
        'en': "Avg Length",
        'zh': "平均长度"
    },
    'metric_top_word': {
        'en': "Top Keyword",
        'zh': "Top 1 关键词"
    },
    'tab_insight': {
        'en': "🧠 Insights",
        'zh': "🧠 思维洞察"
    },
    'tab_habit': {
        'en': "📅 Habits",
        'zh': "📅 习惯追踪"
    },
    'tab_data': {
        'en': "📋 Raw Data",
        'zh': "📋 原始数据"
    },
    'radar_header': {
        'en': "🕸️ Skill Radar",
        'zh': "🕸️ 技能雷达 (Skill Radar)"
    },
    'cloud_header': {
        'en': "☁️ Word Cloud",
        'zh': "☁️ 双语思维词云"
    },
    'cloud_warning': {
        'en': "Not enough data for word cloud",
        'zh': "数据量不足以生成词云"
    },
    'dist_header': {
        'en': "📈 Depth & Length Distribution",
        'zh': "📈 深度与长度分布"
    },
    'dist_len_title': {
        'en': "Prompt Length Distribution",
        'zh': "Prompt 长度分布"
    },
    'dist_len_label': {
        'en': "Characters",
        'zh': "字符数"
    },
    'dist_comp_title': {
        'en': "Complexity Score Distribution (0-100)",
        'zh': "思维深度评分分布 (0-100)"
    },
    'dist_comp_label': {
        'en': "Complexity Score",
        'zh': "复杂度评分"
    },
    'phrases_header': {
        'en': "🔗 Top Phrases",
        'zh': "🔗 你最爱用的短语 (Top Phrases)"
    },
    'habit_heatmap_header': {
        'en': "🔥 Activity Heatmap (GitHub Style)",
        'zh': "🔥 活跃热力图 (GitHub Style)"
    },
    'trend_caption': {
        'en': "📅 Daily Activity Trend",
        'zh': "📅 每日活跃度趋势"
    },
    'hour_caption': {
        'en': "🕰️ 24h Energy Distribution",
        'zh': "🕰️ 24小时精力分布"
    },
    'tab_bar': {
        'en': "Bar Chart",
        'zh': "柱状图"
    },
    'tab_line': {
        'en': "Line Chart",
        'zh': "折线图"
    },
    'hour_label': {
        'en': "Hour (0-23)",
        'zh': "小时 (0-23)"
    },
    'count_label': {
        'en': "Count",
        'zh': "数量"
    },
    'habit_warning': {
        'en': "⚠️ Missing timestamp data. Please use new extension version to export.",
        'zh': "⚠️ 数据缺少时间戳，无法显示习惯追踪。请使用新版插件导出 JSON。"
    },
    'search_header': {
        'en': "🔍 Deep Search",
        'zh': "🔍 深度搜索"
    },
    'search_placeholder': {
        'en': "Search keywords...",
        'zh': "搜索关键词..."
    },
    'min_score_label': {
        'en': "Min Complexity",
        'zh': "最低复杂度"
    },
    'col_content': {
        'en': "Content",
        'zh': "内容"
    },
    'col_score': {
        'en': "Score",
        'zh': "深度分"
    },
    'col_len': {
        'en': "Length",
        'zh': "长度"
    },
    'col_time': {
        'en': "Time",
        'zh': "时间"
    }
}

def t(key):
    """Get translated text based on session state"""
    return TRANSLATIONS.get(key, {}).get(st.session_state.lang, key)

# --- NLTK Setup (Fail-safe) ---
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    try:
        nltk.download('punkt', quiet=True)
    except: pass

try:
    nltk.data.find('corpora/stopwords')
    from nltk.corpus import stopwords
    english_stops = set(stopwords.words('english'))
except (LookupError, ImportError):
    english_stops = set()

# Enhanced Stopwords (De-noising)
english_stops.update({
    "the", "a", "an", "in", "on", "at", "for", "to", "of", "is", "are", "was", "were", 
    "be", "been", "being", "have", "has", "had", "do", "does", "did", "it", "that", 
    "this", "these", "those", "i", "you", "he", "she", "we", "they", "my", "your", 
    "his", "her", "our", "their", "what", "which", "who", "whom", "whose", "where", 
    "when", "why", "how", "can", "could", "will", "would", "shall", "should", "may", 
    "might", "must", "and", "but", "or", "so", "not", "no", "yes", "please", "help", 
    "me", "thanks", "thank", "write", "create", "make", "use", "using", "code",
    "want", "need", "like", "just", "get", "go", "know", "think", "see", "say",
    "tell", "ask", "try", "look", "take", "give", "find", "use", "way", "new",
    "good", "great", "well", "much", "many", "lot", "little", "big", "small",
    # Prompt Engineering Boilerplate (Noise for WordCloud)
    "act", "role", "assume", "step", "context", "instruction", "output", "format",
    "generate", "rewrite", "revise", "optimize", "check", "verify", "explain",
    "translation", "translate", "english", "chinese", "text", "sentence", "paragraph",
    "based", "following", "provided", "below", "above", "result", "answer", "question",
    "style", "tone", "ensure", "make", "sure", "include", "example", "list"
})

# 中文停用词 (De-noising)
chinese_stops = {
    "的", "了", "是", "我", "你", "他", "在", "和", "有", "就", "不", "人", "都", "一", "一个", "上", "也", "很", "到", "说", "要", "去", "能", "会", "着", "没有", "看", "怎么", "什么", "这", "那", "这个", "那个", "请", "帮我", "给我", "可以", "吗",
    "个", "只", "次", "把", "被", "让", "给", "但", "因为", "所以", "如果", "虽然", "但是", "或者", "还是", "以及", "除了", "为了", "关于", "对于", "通过", "根据", "按照", "作为", "随着",
    # Prompt Engineering Boilerplate (Chinese)
    "扮演", "角色", "生成", "输出", "格式", "要求", "上下文", "步骤", "解释", "翻译",
    "英文", "中文", "代码", "文章", "内容", "以下", "以上", "提供", "基于", "使用",
    "不仅", "而且", "能够", "需要", "帮忙", "修改", "润色", "优化", "检查", "写一个",
    "帮我写", "帮我看", "怎么写", "怎么做"
}

# 页面配置
st.set_page_config(page_title="SPR Mind Cockpit", layout="wide", page_icon="🧠")

# --- Query Param Routing (For Privacy Policy) ---
if st.query_params.get("page") == "privacy":
    st.title("🔒 Privacy Policy")
    st.caption("Last Updated: 2026/1/3")

    st.markdown("""
    <style>
        .privacy-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px;
            margin-top: 20px;
        }
    </style>
    <div class="privacy-card">

    ### 1) Scope
    This Privacy Policy applies to:
    * The **Prompt Mirror Chrome extension** (“Extension”)
    * The **Prompt Mirror website / landing page / documentation** (“Website”)

    If you are viewing our Website via a third-party hosting provider (e.g., Streamlit), that provider may collect certain technical logs as described below.

    ---

    ### 2) Our Privacy Principles (Plain English)
    * **Local-first:** By default, your prompt records and analytics are stored locally in your browser.
    * **User control:** You can export or delete your data at any time.
    * **No background scraping:** The Extension does not continuously monitor your browsing. It only runs when you interact with it.
    * **Data minimization:** We do not ask for sensitive personal data to use core features.

    ---

    ### 3) What Information We Collect

    #### A. Data you provide / create inside the Extension (Local by default)
    When you use the Extension, it may store the following locally on your device:
    * Prompt text you choose to record (e.g., text you type or select)
    * Timestamps (when a prompt was recorded)
    * Basic source context (e.g., site domain or a page identifier, if enabled)
    * Analytics derived from your prompts (counts, trends, summaries)
    * Extension preferences/settings (allowlist, toggles, display settings)

    **Important:** This data is stored locally in your browser storage unless you explicitly enable a feature that sends data elsewhere.

    #### B. Website technical data (Hosting logs)
    Our Website may be hosted by a third-party platform (e.g., Streamlit). Like most hosting services, it may automatically collect:
    * IP address
    * Device/browser type
    * Pages viewed and timestamps
    * Basic diagnostic logs (crash/latency)

    We use these logs only for security, reliability, and performance monitoring.

    #### C. Data we do NOT intentionally collect
    We do not intentionally collect:
    * Government IDs, passwords, financial/payment card details
    * Health or medical information
    * Precise GPS location
    * Sensitive categories (unless you voluntarily type them into your own prompts)

    If you include sensitive info in your prompts, it will be treated as part of your prompt data and will remain local unless you export/share it.

    ---

    ### 4) How We Use Information
    We use information to:
    * Provide core functionality (recording prompts, generating analytics)
    * Store your settings and preferences
    * Maintain service security and stability (website logs, if any)
    * Improve UX and fix bugs (aggregated, non-identifying insights when possible)

    ---

    ### 5) Sharing & Disclosure

    #### A. We do not sell your data
    We do not sell, rent, or trade your personal data.

    #### B. Local storage by default
    Prompt data and analytics remain on your device by default.

    #### C. Optional network requests (if applicable)
    If the Extension provides optional features that require network requests (e.g., syncing, cloud backup, or calling a user-configured analysis endpoint), those requests:
    * Are triggered by your action or enabled settings
    * Are limited to the minimum data needed for the feature
    * Do not download or execute remote code inside the Extension

    If you do not enable such features, no prompt content is transmitted.

    #### D. Legal and safety
    We may disclose information if required by law or to protect rights and safety (e.g., responding to lawful requests).

    ---

    ### 6) Permissions & Why We Need Them (Chrome Extension)
    Depending on your build, the Extension may request:
    * `storage`: to save prompt records, analytics, and user settings locally
    * `activeTab` / `scripting`: to read user-entered/selected text on the current page only when you trigger an action (e.g., “Record/Analyze”)
    * `host permissions` (site access): to run on user-approved sites where you want to record prompts (preferably allowlisted domains)

    The Extension is designed to operate only on user action and does not continuously scan pages in the background.

    ---

    ### 7) Data Retention
    * Local prompt data is retained until you delete it.
    * Website logs (if any) are retained for a limited period as required for security and performance, then deleted or anonymized.

    ---

    ### 8) Data Security
    We use reasonable measures to protect data:
    * Local-first storage reduces transmission risk
    * Access is limited to user-triggered actions and allowed sites
    However, no method of storage is 100% secure. You are responsible for safeguarding exported files you download.

    ---

    ### 9) Your Choices & Rights
    You can:
    * View, export, and delete your stored prompt data within the Extension
    * Disable recording on specific sites via allowlist/denylist settings
    * Uninstall the Extension to remove local data (depending on browser behavior)

    If you have questions or requests, contact us at: [ming.t.yang@vanderbilt.edu](mailto:ming.t.yang@vanderbilt.edu)

    ---

    ### 10) Children’s Privacy
    Prompt Mirror is not intended for children under 13 (or the minimum age required in your region). We do not knowingly collect personal data from children.

    ### 11) International Users
    If you access the Website from outside the hosting region, your connection may involve cross-border data transmission of basic technical logs. Prompt data remains local by default unless you enable features that transmit it.

    ### 12) Changes to This Policy
    We may update this policy from time to time. We will revise the “Last Updated” date and, if changes are material, provide a more prominent notice.

    ### 13) Contact
    **Prompt Mirror Team**  
    Email: [ming.t.yang@vanderbilt.edu](mailto:ming.t.yang@vanderbilt.edu)

    </div>
    """, unsafe_allow_html=True)
    
    if st.button("← Back to Dashboard"):
        st.query_params.clear()
        st.rerun()
        
    st.stop() # Stop execution of the main app

# --- 字体处理 (Mac 乱码终结版 - WordCloud用) ---
import platform
def get_chinese_font():
    system = platform.system()
    if system == "Darwin": # Mac
        fonts = [
            "/System/Library/Fonts/PingFang.ttc", 
            "/System/Library/Fonts/STHeiti Light.ttc",
            "/System/Library/Fonts/Hiragino Sans GB.ttc",
            "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
            "/Library/Fonts/Arial Unicode.ttf"
        ]
        for f in fonts:
            try: 
                open(f)
                return f
            except: continue
    return None 

font_path = get_chinese_font()

# --- Luxury CSS Injection ---
luxury_css = """
<style>
    /* Global Background: Deep Blue-Black Gradient */
    .stApp {
        background: radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 40%, #020617 100%) !important;
        color: #e2e8f0;
    }

    /* Noise Texture Overlay */
    .stApp::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 0;
    }

    /* Liquid Glass Cards */
    .stMetric, .stDataFrame, .stPlotlyChart {
        background: rgba(255, 255, 255, 0.03) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 16px !important;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        padding: 16px !important;
        transition: all 0.3s ease;
    }

    .stMetric:hover, .stDataFrame:hover {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        transform: translateY(-2px);
        box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
    }

    /* Metric Values (Champagne Gold) */
    [data-testid="stMetricValue"] {
        color: #D4AF37 !important;
        font-family: 'Helvetica Neue', sans-serif;
        font-weight: 300;
        text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }
    
    /* Metric Labels (Soft White) */
    [data-testid="stMetricLabel"] {
        color: rgba(255, 255, 255, 0.7) !important;
        font-size: 0.9em;
        letter-spacing: 0.5px;
    }

    /* Sidebar Luxury */
    [data-testid="stSidebar"] {
        background: rgba(15, 23, 42, 0.95) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Buttons (Glassy) */
    .stButton > button {
        background: rgba(255, 255, 255, 0.05) !important;
        color: #D4AF37 !important;
        border: 1px solid rgba(212, 175, 55, 0.3) !important;
        border-radius: 8px;
        transition: all 0.3s;
    }
    .stButton > button:hover {
        background: rgba(212, 175, 55, 0.1) !important;
        border-color: #D4AF37 !important;
        box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
    }

    /* Titles */
    h1, h2, h3 {
        color: #f8fafc !important;
        font-weight: 300 !important;
        letter-spacing: -0.5px;
    }


    /* File Uploader Enhancement (High Visibility) */
    [data-testid="stFileUploader"] {
        background: rgba(255, 255, 255, 0.05);
        border: 2px dashed rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 30px;
        transition: all 0.3s ease;
        text-align: center;
    }
    [data-testid="stFileUploader"]:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: #D4AF37;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        transform: scale(1.02);
    }
    [data-testid="stFileUploader"] section {
        background: transparent !important;
    }
    [data-testid="stFileUploader"] button {
        background: rgba(212, 175, 55, 0.2) !important;
        color: #D4AF37 !important;
        border: 1px solid #D4AF37 !important;
        font-weight: bold;
    }
</style>
"""
st.markdown(luxury_css, unsafe_allow_html=True)


# --- Top Bar: Language Toggle Only ---
col_title, col_lang = st.columns([6, 1])

with col_lang:
    if st.button("🌐 " + ("CN" if st.session_state.lang == 'en' else "EN"), help="Switch Language"):
        st.session_state.lang = 'zh' if st.session_state.lang == 'en' else 'en'
        st.rerun()

with col_title:
    st.title(t('page_title'))
    st.caption(t('page_caption'))


# --- 侧边栏：上传与配置 ---
with st.sidebar:
    st.header(t('upload_header'))
    st.info(t('upload_info'))
    up = st.file_uploader(t('upload_label'), type=["json", "txt", "jsonl"])
    
    st.divider()
    st.header(t('settings_header'))
    exclude_short = st.checkbox(t('filter_short'), value=True)
    strict_filter = st.checkbox(t('filter_strict'), value=False)
    
    st.markdown("---")
    with st.expander(t('privacy_title')):
        st.markdown(t('privacy_content'))
        st.markdown("[📄 Full Privacy Policy (Click Here)](/?page=privacy)")
            
        st.markdown("---")
        st.caption("👇 **Copy for Google Store:**")
        st.code("https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/?page=privacy", language="text")

# --- 关键 CSS 动画定义 ---
st.markdown("""
<style>
@keyframes bounce-left {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-10px); }
}
@keyframes bounce-up-right {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -10px); }
}
.animate-arrow {
  animation: bounce-left 1.5s infinite ease-in-out;
  display: inline-block;
}
.animate-arrow-ur {
  animation: bounce-up-right 1.5s infinite ease-in-out;
  display: inline-block;
}
</style>
""", unsafe_allow_html=True)

# --- Empty State (Onboarding Guide) ---
def show_onboarding_guide():
    st.markdown("<br><br>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        # Flattened HTML to prevent Markdown code block parsing
        html_content = """
<div style="text-align: center; padding: 40px; background: rgba(255,255,255,0.03); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
<div style="font-size: 60px; margin-bottom: 20px;">🚀</div>
<h2 style="color: #D4AF37;">Welcome to Mind Cockpit</h2>
<p style="color: rgba(255,255,255,0.7); font-size: 18px; margin-bottom: 30px;">Your personal thinking analytics dashboard is ready.</p>
<div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 40px;">
<div class="animate-arrow-ur" style="font-size: 40px; color: #4cc9f0;">↗️</div>
<div style="text-align: left;">
<div style="font-weight: bold; color: #fff; font-size: 20px;">Step 1</div>
<div style="color: rgba(255,255,255,0.6);">Click Extension in top-right to export <code>my_prompts.json</code></div>
</div>
</div>
<div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 20px;">
<div class="animate-arrow" style="font-size: 40px; color: #4cc9f0;">👈</div>
<div style="text-align: left;">
<div style="font-weight: bold; color: #fff; font-size: 20px;">Step 2</div>
<div style="color: rgba(255,255,255,0.6);">Drag & Drop file to the sidebar</div>
</div>
</div>
</div>
"""
        st.markdown(html_content, unsafe_allow_html=True)

# --- 数据加载与持久化逻辑 ---
lines = []
timestamps = []
sources = []

if up:
    try:
        content = up.read().decode('utf-8', errors='ignore')
        new_lines = []
        new_timestamps = []
        new_sources = []
        
        if up.name.endswith('.json'):
            try:
                data = json.loads(content)
                if isinstance(data, list) and len(data) > 0:
                    if 'text' in data[0]: 
                        for item in data:
                            text = item.get('text', '')
                            # Junk Filter: Remove pure punctuation/numbers or very short generic words
                            if exclude_short and len(text) < 5: continue
                            if re.match(r'^[\s\d\W]+$', text): continue # Only symbols/numbers
                            
                            # Strict Filter
                            if strict_filter:
                                if len(text) < 10: continue
                                if any(w in text.lower() for w in ["test", "hello", "hi", "你好", "测试", "demo"]): continue
                            
                            if text.lower().strip() in ["hi", "hello", "test", "testing", "你好", "测试"]: continue
                            
                            new_lines.append(text)
                            ts = item.get('ts', 0)
                            if ts > 0: new_timestamps.append(datetime.fromtimestamp(ts / 1000))
                            new_sources.append(item.get('src', 'unknown'))
                    elif 'mapping' in data[0]:
                         for conv in data:
                            if 'mapping' in conv:
                                for k, v in conv['mapping'].items():
                                    if v['message'] and v['message']['author']['role'] == 'user':
                                        parts = v['message']['content']['parts']
                                        if parts: 
                                            text = str(parts[0])
                                            if exclude_short and len(text) < 5: continue
                                            new_lines.append(text)
                                            ct = v['message'].get('create_time')
                                            if ct: new_timestamps.append(datetime.fromtimestamp(ct))
            except json.JSONDecodeError:
                pass 

        if not new_lines: 
             if up.name.endswith('.jsonl'):
                for line in content.splitlines():
                    if line.strip():
                        try:
                            msg = json.loads(line)
                            if 'messages' in msg: new_lines.append(msg['messages'][0]['content'])
                        except: pass
             else:
                new_lines = [l.strip() for l in content.split('===SPLIT===') if l.strip()]
                if len(new_lines) < 2:
                     new_lines = [l.strip() for l in content.splitlines() if l.strip()]

        if new_lines:
            st.session_state.cached_data = {
                'lines': new_lines,
                'timestamps': new_timestamps,
                'sources': new_sources
            }
            
    except Exception as e:
        st.error(t('upload_error').format(e))

if st.session_state.cached_data:
    lines = st.session_state.cached_data['lines']
    timestamps = st.session_state.cached_data['timestamps']
    sources = st.session_state.cached_data['sources']

if not lines:
    show_onboarding_guide() # 👈 调用空状态指引
    st.stop()

# --- 数据预处理 ---
df = pd.DataFrame({"prompt": lines})
df["len"] = df["prompt"].str.len()

if timestamps and len(timestamps) == len(lines):
    df["time"] = timestamps
    df["hour"] = df["time"].dt.hour
    df["date"] = df["time"].dt.date
    df["weekday"] = df["time"].dt.weekday  # 0=Monday
    df["week_name"] = df["time"].dt.day_name()
    has_time = True
else:
    has_time = False

# --- 核心算法：复杂度评分 (Complexity Score 2.0) ---
def calculate_complexity(text):
    score = 0
    text_lower = text.lower()
    
    # 1. Base Score (Length)
    score += min(len(text) / 200, 1.0) * 30  # Reduced base weight
    
    # 2. Logical Depth
    logical_words = [
        'if', 'because', 'however', 'therefore', 'although', 'compare', 'difference',
        '如果', '因为', '但是', '所以', '虽然', '比较', '区别', '原理', '分析', 'why', 'how',
        'strategy', 'plan', 'method', 'approach', 'framework', 'model', 'theory'
    ]
    logic_hits = sum(1 for w in logical_words if w in text_lower)
    score += min(logic_hits / 5, 1.0) * 25
    
    # 3. Structural Bonus (Markdown)
    structure_score = 0
    if '```' in text: structure_score += 15  # Code block
    if '\n-' in text or '\n*' in text: structure_score += 10  # List
    if '\n1.' in text: structure_score += 10 # Ordered list
    if '> ' in text: structure_score += 5    # Quote
    score += min(structure_score, 30)
    
    # 4. Cognitive Patterns (Role & CoT)
    cognitive_score = 0
    # Role Prompting
    if any(p in text_lower for p in ['act as', 'role', '扮演', '你是一个', 'you are a']):
        cognitive_score += 10
    # Chain of Thought
    if any(p in text_lower for p in ['step by step', 'chain of thought', 'reasoning', '一步步', '思维链']):
        cognitive_score += 15
    score += min(cognitive_score, 15)

    return min(int(score), 100)

df['complexity'] = df['prompt'].apply(calculate_complexity)

# --- 核心算法：双语分词 (Bilingual NLP + De-noising) ---
@st.cache_data
def process_tokens(text_list):
    all_text = " ".join(text_list)
    
    # 1. 中文分词 (jieba) + 去停用词
    zh_pattern = re.compile(r'[\u4e00-\u9fa5]+')
    zh_words = [w for w in jieba.lcut(all_text) if len(w) > 1 and zh_pattern.match(w) and w not in chinese_stops]
    
    # 2. 英文分词 (简单正则 + NLTK Stopwords)
    en_pattern = re.compile(r'[a-zA-Z]{2,}')
    en_words = en_pattern.findall(all_text.lower())
    en_words = [w for w in en_words if w not in english_stops and len(w) > 2] # Filter super short English words
    
    return zh_words + en_words

words = process_tokens(lines)
word_counts = Counter(words)

# --- Luxury Chart Helper ---
def luxury_chart(fig, title=None, show_median=False, df_col=None):
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='rgba(255,255,255,0.7)', family="Helvetica Neue"),
        title=dict(text=title, font=dict(color='#f8fafc', size=16)),
        xaxis=dict(showgrid=False, zeroline=False, color='rgba(255,255,255,0.4)'),
        yaxis=dict(showgrid=True, gridwidth=1, gridcolor='rgba(255,255,255,0.05)', zeroline=False, color='rgba(255,255,255,0.4)'),
        margin=dict(l=20, r=20, t=50, b=20),
        hovermode="x unified"
    )
    
    if show_median and df_col is not None:
        median = df_col.median()
        p90 = df_col.quantile(0.9)
        
        # Add Lines
        fig.add_vline(x=median, line_width=1, line_dash="dash", line_color="#D4AF37", opacity=0.8)
        fig.add_annotation(x=median, y=1, yref="paper", text=f"Med: {int(median)}", showarrow=False, font=dict(color="#D4AF37", size=10), yshift=10)
        
        fig.add_vline(x=p90, line_width=1, line_dash="dot", line_color="#6A5ACD", opacity=0.8)
        fig.add_annotation(x=p90, y=1, yref="paper", text=f"P90: {int(p90)}", showarrow=False, font=dict(color="#6A5ACD", size=10), yshift=10)

    return fig

# --- Dashboard 概览 ---
st.subheader(t('overview_header'))
c1, c2, c3, c4 = st.columns(4)
c1.metric(t('metric_total'), f"{len(df)}", delta=f"Avg Complexity: {int(df['complexity'].mean())}")
c2.metric(t('metric_vocab'), f"{len(word_counts)}")
c3.metric(t('metric_avg_len'), f"{int(df['len'].mean())}")
top_word = word_counts.most_common(1)[0][0] if word_counts else "N/A"
c4.metric(t('metric_top_word'), top_word)

st.divider()

# --- Tab 布局 ---
tab_insight, tab_habit, tab_data, tab_manage = st.tabs([t('tab_insight'), t('tab_habit'), t('tab_data'), t('tab_manage')])

# === Tab 1: 思维洞察 ===
with tab_insight:
    col_radar, col_cloud = st.columns([1, 1.5])
    
    with col_radar:
        st.subheader(t('radar_header'))
        
        category_defs = {
            "coding": {
                "keywords": [
                    "代码", "code", "函数", "报错", "bug", "python", "js", "react", "sql", "api", "写一个", "实现", "function", "class", "error", "接口",
                    "java", "c++", "golang", "rust", "node", "css", "html", "docker", "k8s", "aws", "git", "github", "merge", "branch", "commit",
                    "database", "db", "mongo", "redis", "query", "request", "response", "json", "xml", "yaml", "config", "deploy", "build", "run",
                    "script", "algorithm", "loop", "variable", "import", "package", "install", "pip", "npm", "yarn", "compile", "debug", "stack",
                    "overflow", "exception", "try", "catch", "async", "await", "promise", "thread", "process", "linux", "shell", "bash", "terminal",
                    "fix", "issue", "crash", "stacktrace", "ci/cd", "pipeline", "jenkins", "azure", "gcp", "server", "client", "frontend", "backend",
                    "fullstack", "devops", "sre", "unit test", "integration test", "e2e", "selenium", "cypress", "playwright", "jest", "mocha",
                    "typescript", "ts", "vue", "angular", "svelte", "nextjs", "nuxtjs", "flask", "django", "fastapi", "spring", "hibernate",
                    "refactor", "optimize", "performance", "memory", "cpu", "leak", "profiling", "benchmark", "logging", "monitoring", "alerting",
                    "rest", "graphql", "grpc", "websocket", "socket", "tcp", "udp", "http", "https", "ssl", "tls", "certificate", "key", "token",
                    "auth", "jwt", "oauth", "sso", "ldap", "encryption", "hashing", "salt", "uuid", "guid", "regex", "regular expression"
                ],
                "label_en": "Coding",
                "label_zh": "💻 编程开发"
            },
            "writing": {
                "keywords": [
                    "文案", "文章", "周报", "总结", "扩写", "润色", "大纲", "标题", "翻译", "邮件", "write", "email", "article", "summary", "translate", "outline", "title",
                    "essay", "blog", "post", "copy", "copywriting", "intro", "introduction", "conclusion", "paragraph", "sentence", "grammar", "spelling",
                    "tone", "style", "formal", "casual", "academic", "professional", "rewrite", "revise", "edit", "proofread", "check", "draft",
                    "report", "memo", "letter", "proposal", "statement", "bio", "description", "caption", "slogan", "tagline", "keyword", "seo",
                    "story", "narrative", "plot", "character", "dialogue", "script", "screenplay", "poem", "lyrics", "rhyme", "verse"
                ],
                "label_en": "Writing",
                "label_zh": "📝 内容创作"
            },
            "logic": {
                "keywords": [
                    "分析", "原因", "区别", "比较", "评价", "优缺点", "建议", "方案", "思维导图", "analyze", "reason", "compare", "difference", "pros", "cons", "plan",
                    "strategy", "tactic", "method", "approach", "framework", "model", "theory", "hypothesis", "assumption", "premise", "conclusion",
                    "argument", "debate", "critique", "review", "evaluate", "assess", "audit", "investigate", "research", "study", "survey", "data",
                    "evidence", "proof", "logic", "logical", "fallacy", "bias", "cognitive", "psychology", "philosophy", "ethics", "moral", "value",
                    "principle", "rule", "law", "regulation", "policy", "guideline", "standard", "criteria", "metric", "kpi", "okr", "goal", "objective"
                ],
                "label_en": "Logic",
                "label_zh": "🧠 逻辑分析"
            },
            "learning": {
                "keywords": [
                    "解释", "介绍", "是什么", "含义", "原理", "教程", "学习", "如何", "explain", "what", "how", "meaning", "tutorial", "principle", "learn",
                    "teach", "guide", "lesson", "course", "class", "lecture", "study", "exam", "test", "quiz", "question", "answer", "solution",
                    "definition", "define", "concept", "term", "vocabulary", "grammar", "history", "geography", "science", "math", "physics", "chemistry",
                    "biology", "art", "music", "literature", "culture", "language", "skill", "technique", "tip", "trick", "hack", "advice", "suggestion",
                    "recommendation", "resource", "book", "paper", "article", "video", "podcast", "website", "tool", "software", "app",
                    "roadmap", "path", "curriculum", "syllabus", "beginner", "intermediate", "advanced", "expert", "master", "pro", "101", "basics",
                    "fundamentals", "overview", "introduction", "background", "context", "history", "origin", "evolution", "development", "trend",
                    "future", "prediction", "forecast", "insight", "knowledge", "wisdom", "experience", "expertise", "mastery", "proficiency",
                    "competence", "capability", "ability", "talent", "gift", "aptitude", "potential", "growth", "development", "progress"
                ],
                "label_en": "Learning",
                "label_zh": "🎓 知识学习"
            },
            "creative": {
                "keywords": [
                    "创意", "点子", "故事", "设想", "如果", "生成", "设计", "idea", "story", "design", "imagine", "generate", "create",
                    "brainstorm", "concept", "inspiration", "vision", "dream", "fantasy", "fiction", "novel", "game", "play", "fun", "joke", "humor",
                    "comedy", "satire", "parody", "meme", "logo", "icon", "image", "picture", "photo", "video", "audio", "music", "song", "sound",
                    "color", "palette", "font", "typography", "layout", "ui", "ux", "wireframe", "prototype", "mockup", "sketch", "drawing", "painting",
                    "character", "role", "persona", "profile", "background", "backstory", "plot", "setting", "scene", "dialogue", "script", "screenplay",
                    "poem", "haiku", "limerick", "sonnet", "lyrics", "verse", "rhyme", "rhythm", "melody", "harmony", "chord", "scale", "key",
                    "style", "genre", "mood", "atmosphere", "vibe", "tone", "voice", "narrator", "perspective", "viewpoint", "theme", "motif",
                    "symbol", "metaphor", "simile", "analogy", "allegory", "fable", "myth", "legend", "folklore", "fairy tale", "fantasy", "sci-fi"
                ],
                "label_en": "Creative",
                "label_zh": "🎨 创意脑暴"
            }
        }
        
        cat_scores = {k: 0 for k in category_defs.keys()}
        for w in words:
            for cat_key, cat_data in category_defs.items():
                if w in cat_data['keywords']:
                    cat_scores[cat_key] += 1
        
        vals = list(cat_scores.values())
        max_val = max(vals) if vals else 1
        normalized_vals = [v/max_val for v in vals]
        labels = [category_defs[k][f'label_{st.session_state.lang}'] for k in category_defs.keys()]
        
        fig_radar = px.line_polar(r=normalized_vals, theta=labels, line_close=True, template="plotly_dark")
        fig_radar.update_traces(fill='toself', line_color='#D4AF37') # Champagne Gold
        fig_radar.update_layout(
            polar=dict(
                radialaxis=dict(visible=False),
                bgcolor='rgba(0,0,0,0)'
            ),
            margin=dict(t=20, b=20, l=30, r=30),
            height=350,
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)'
        )
        st.plotly_chart(fig_radar, use_container_width=True)

    with col_cloud:
        st.subheader(t('cloud_header'))
        if words:
            # WordCloud with Luxury Colors
            def luxury_color_func(word, font_size, position, orientation, random_state=None, **kwargs):
                return "hsl(46, 65%, 60%)" if random_state.randint(0, 1) else "hsl(245, 40%, 70%)"

            wc = WordCloud(font_path=font_path, width=800, height=500, 
                          background_color=None, mode="RGBA", # Transparent
                          max_words=80, collocations=False,
                          color_func=luxury_color_func).generate(" ".join(words))
            st.image(wc.to_array(), use_column_width=True)
        else:
            st.warning(t('cloud_warning'))

    st.subheader(t('dist_header'))
    c_len, c_comp = st.columns(2)
    
    with c_len:
        fig_len = px.histogram(
             df, x="len", nbins=30,
             color_discrete_sequence=['#D4AF37'], # Champagne Gold
             template="plotly_dark"
        )
        fig_len.update_traces(
            marker=dict(line=dict(width=1, color='rgba(255,255,255,0.5)'), pattern=dict(shape="/")), # Glassy Edge + Texture
            opacity=0.8
        )
        luxury_chart(fig_len, t('dist_len_title'), show_median=True, df_col=df['len'])
        st.plotly_chart(fig_len, use_container_width=True)

    with c_comp:
        fig_comp = px.histogram(
            df, x="complexity", nbins=20, 
            color_discrete_sequence=['#6A5ACD'], # Royal Purple
            template="plotly_dark"
        )
        fig_comp.update_traces(
            marker=dict(line=dict(width=1, color='rgba(255,255,255,0.5)'), pattern=dict(shape="+")), # Glassy Edge + Texture
            opacity=0.8
        )
        luxury_chart(fig_comp, t('dist_comp_title'), show_median=True, df_col=df['complexity'])
        st.plotly_chart(fig_comp, use_container_width=True)

    # 恢复高频词组 (Bigrams) 板块
    st.divider()
    st.subheader(t('phrases_header'))
    
    bigrams = []
    # Advanced Bigram Filter
    # Stopwords for Bigrams (Less aggressive)
    bigram_stops = {
        "the", "a", "an", "in", "on", "at", "for", "to", "of", "is", "are", "was", "were", 
        "be", "been", "being", "have", "has", "had", "do", "does", "did", "it", "that", 
        "this", "these", "those", "i", "you", "he", "she", "we", "they", "my", "your", 
        "his", "her", "our", "their", "and", "but", "or", "so", "not", "no", "yes", "please", 
        "me", "thanks", "thank", "want", "need", "like", "just", "get", "go", "know", "think", 
        "see", "say", "tell", "ask", "try", "look", "take", "give", "find", "use", "way", "new",
        "good", "great", "well", "much", "many", "lot", "little", "big", "small",
        "的", "了", "是", "我", "你", "他", "在", "和", "有", "就", "不", "人", "都", "一", "一个", "上", "也", "很", "到", "说", "要", "去", "能", "会", "着", "没有", "看", "怎么", "什么", "这", "那", "这个", "那个", "请", "帮我", "给我", "可以", "吗",
        "个", "只", "次", "把", "被", "让", "给", "但", "因为", "所以", "如果", "虽然", "但是", "或者", "还是", "以及", "除了", "为了", "关于", "对于", "通过", "根据", "按照", "作为", "随着"
    }

    for line in lines:
        # Tokenize line again but use the robust filter
        line_tokens = []
        # Chinese
        zh_pattern = re.compile(r'[\u4e00-\u9fa5]+')
        for w in jieba.lcut(line):
            if len(w) > 1 and zh_pattern.match(w) and w not in bigram_stops:
                line_tokens.append(w)
        # English
        en_pattern = re.compile(r'[a-zA-Z]{2,}')
        for w in en_pattern.findall(line.lower()):
            if w not in bigram_stops and len(w) > 2:
                line_tokens.append(w)
        
        if len(line_tokens) >= 2:
            for i in range(len(line_tokens)-1):
                # Filter meaningless bigrams
                w1, w2 = line_tokens[i], line_tokens[i+1]
                if w1 in bigram_stops or w2 in bigram_stops: continue
                bigrams.append(f"{w1} {w2}")

    top_bigrams = Counter(bigrams).most_common(12)

    # HTML/CSS Visuals for Top Phrases
    st.markdown("""
    <style>
    .phrase-tag {
        display: inline-block;
        padding: 6px 12px;
        margin: 4px;
        border-radius: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.1);
        transition: transform 0.2s;
    }
    .phrase-tag:hover {
        transform: scale(1.05);
        border-color: #D4AF37;
    }
    </style>
    """, unsafe_allow_html=True)

    if top_bigrams:
        max_count = top_bigrams[0][1]
        html = "<div style='text-align: center; padding: 20px;'>"
        for phrase, count in top_bigrams:
            # Opacity based on frequency
            opacity = 0.3 + 0.7 * (count / max_count)
            # Gold color with varying opacity
            bg_color = f"rgba(212, 175, 55, {opacity})" 
            html += f"<span class='phrase-tag' style='background: {bg_color};' title='Count: {count}'>{phrase}</span>"
        html += "</div>"
        st.markdown(html, unsafe_allow_html=True)
    else:
        st.info("💡 Not enough data to generate top phrases yet. Try adding more diverse prompts!")

    # === Tab 2: 习惯追踪 ===
    with tab_habit:
        if has_time:
            st.subheader(t('habit_heatmap_header'))
            
            daily_counts = df['date'].value_counts().reset_index()
            daily_counts.columns = ['date', 'count']
            daily_counts['date'] = pd.to_datetime(daily_counts['date'])
            
            c1, c2 = st.columns([2, 1])
            
            with c1:
                st.caption(t('trend_caption'))
                fig_trend = px.bar(daily_counts.sort_values('date'), x='date', y='count', 
                                  color='count', color_continuous_scale='Blues', template="plotly_dark")
                luxury_chart(fig_trend, title=t('trend_caption'))
                st.plotly_chart(fig_trend, use_container_width=True)
                
            with c2:
                st.caption(t('hour_caption'))
                hour_counts = df['hour'].value_counts().sort_index().reset_index()
                hour_counts.columns = ['hour', 'count']
                
                tab_bar, tab_line = st.tabs([t('tab_bar'), t('tab_line')])
                
                with tab_bar:
                    fig_bar = px.bar(
                        hour_counts, x='hour', y='count',
                        template="plotly_dark"
                    )
                    fig_bar.update_traces(marker_color='#D4AF37')
                    luxury_chart(fig_bar, title=t('hour_caption'))
                    fig_bar.update_layout(xaxis=dict(tickmode='linear', dtick=2))
                    st.plotly_chart(fig_bar, use_container_width=True)
                    
                with tab_line:
                    fig_hour = px.line(hour_counts, x='hour', y='count', markers=True, template="plotly_dark")
                    fig_hour.update_traces(line_color='#6A5ACD')
                    luxury_chart(fig_hour, title=t('hour_caption'))
                    st.plotly_chart(fig_hour, use_container_width=True)
                
        else:
            st.warning(t('habit_warning'))

    # === Tab 3: 原始数据 ===
    with tab_data:
        st.subheader(t('search_header'))
        
        col_search, col_filter = st.columns([3, 1])
        with col_search:
            q = st.text_input(t('search_placeholder'), placeholder="Python, Writing...")
        with col_filter:
            min_score = st.slider(t('min_score_label'), 0, 100, 0)
        
        filtered_df = df.copy()
        if q:
            filtered_df = filtered_df[filtered_df['prompt'].str.contains(q, case=False)]
        filtered_df = filtered_df[filtered_df['complexity'] >= min_score]
        
        if has_time:
            filtered_df['time_str'] = filtered_df['time'].dt.strftime('%Y-%m-%d %H:%M')
            show_cols = ['time_str', 'prompt', 'complexity', 'len']
        else:
            show_cols = ['prompt', 'complexity', 'len']
            
        st.dataframe(
            filtered_df[show_cols].sort_values('complexity', ascending=False),
            column_config={
                "prompt": st.column_config.TextColumn(t('col_content'), width="large"),
                "complexity": st.column_config.ProgressColumn(t('col_score'), format="%d", min_value=0, max_value=100),
                "len": st.column_config.NumberColumn(t('col_len')),
                "time_str": st.column_config.TextColumn(t('col_time'))
            },
            use_container_width=True,
            height=600,
            hide_index=True
        )

    # === Tab 4: 数据管理 ===
    with tab_manage:
        st.subheader(t('manage_header'))
        
        if 'delete_indices' not in st.session_state:
            st.session_state.delete_indices = []

        manage_df = df.copy()
        if has_time:
            manage_df['time_str'] = manage_df['time'].dt.strftime('%Y-%m-%d %H:%M')
        else:
            manage_df['time_str'] = "N/A"
            
        manage_df['delete'] = False
        
        edited_df = st.data_editor(
            manage_df[['delete', 'prompt', 'time_str', 'len']],
            column_config={
                "delete": st.column_config.CheckboxColumn("Select", width="small"),
                "prompt": st.column_config.TextColumn(t('col_content'), width="large"),
                "time_str": st.column_config.TextColumn(t('col_time'), width="medium"),
                "len": st.column_config.NumberColumn(t('col_len'), width="small")
            },
            hide_index=True,
            use_container_width=True,
            height=500
        )
        
        to_delete = edited_df[edited_df['delete'] == True]
        
        if not to_delete.empty:
            if st.button(f"{t('delete_btn')} ({len(to_delete)})", type="primary"):
                # Perform deletion
                # We need to find the original indices. Since df matches lines/timestamps lists by index
                delete_indices = set(to_delete.index)
                
                new_lines = []
                new_timestamps = []
                new_sources = []
                
                for i in range(len(lines)):
                    if i not in delete_indices:
                        new_lines.append(lines[i])
                        if timestamps: new_timestamps.append(timestamps[i])
                        if sources: new_sources.append(sources[i])
                
                # Update Cache
                st.session_state.cached_data['lines'] = new_lines
                st.session_state.cached_data['timestamps'] = new_timestamps
                st.session_state.cached_data['sources'] = new_sources
                
                st.success("Deleted successfully! Reloading...")
                st.rerun()
