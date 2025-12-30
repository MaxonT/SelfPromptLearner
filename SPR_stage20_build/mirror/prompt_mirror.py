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

# --- Session State Management (Persistence) ---
if 'lang' not in st.session_state:
    # Check query params for initial language
    qp = st.query_params
    st.session_state.lang = qp.get('lang', 'en') # Default English

if 'theme' not in st.session_state:
    st.session_state.theme = 'light' # Default Light

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
    english_stops = {
        "the", "a", "an", "in", "on", "at", "for", "to", "of", "is", "are", "was", "were", 
        "be", "been", "being", "have", "has", "had", "do", "does", "did", "it", "that", 
        "this", "these", "those", "i", "you", "he", "she", "we", "they", "my", "your", 
        "his", "her", "our", "their", "what", "which", "who", "whom", "whose", "where", 
        "when", "why", "how", "can", "could", "will", "would", "shall", "should", "may", 
        "might", "must", "and", "but", "or", "so", "not", "no", "yes", "please", "help", 
        "me", "thanks", "thank", "write", "create", "make", "use", "using", "code"
    }

# 中文停用词 (De-noising)
chinese_stops = {
    "的", "了", "是", "我", "你", "他", "在", "和", "有", "就", "不", "人", "都", "一", "一个", "上", "也", "很", "到", "说", "要", "去", "能", "会", "着", "没有", "看", "怎么", "什么", "这", "那", "这个", "那个", "请", "帮我", "给我", "可以", "吗"
}

# 页面配置
st.set_page_config(page_title="SPR Mind Cockpit", layout="wide", page_icon="🧠")

# --- 字体处理 (Mac 乱码终结版 - WordCloud用) ---
import platform
def get_chinese_font():
    system = platform.system()
    if system == "Darwin": # Mac
        fonts = ["/System/Library/Fonts/PingFang.ttc", 
                 "/System/Library/Fonts/STHeiti Light.ttc",
                 "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"]
        for f in fonts:
            try: 
                open(f)
                return f
            except: continue
    return None 

font_path = get_chinese_font()

# --- CSS Theme Injection (Real Dark/Light Mode) ---
# Define theme variables
themes = {
    'light': {
        'bg': '#ffffff',
        'secondary_bg': '#f0f2f6',
        'text': '#31333F',
        'card_bg': '#ffffff',
        'card_border': 'rgba(49, 51, 63, 0.1)',
        'metric_val': '#31333F'
    },
    'dark': {
        'bg': '#0e1117',
        'secondary_bg': '#262730',
        'text': '#fafafa',
        'card_bg': '#1e212b',
        'card_border': 'rgba(250, 250, 250, 0.1)',
        'metric_val': '#4cc9f0'
    }
}

current_theme = themes[st.session_state.theme]

theme_css = f"""
<style>
    :root {{
        --primary-color: #4cc9f0;
    }}
    /* Force Theme Colors */
    .stApp {{
        background-color: {current_theme['bg']};
        color: {current_theme['text']};
    }}
    
    /* Sidebar */
    [data-testid="stSidebar"] {{
        background-color: {current_theme['secondary_bg']};
    }}
    [data-testid="stSidebar"] * {{
        color: {current_theme['text']} !important;
    }}
    
    /* Metrics & Cards */
    .stMetric {{ 
        background-color: {current_theme['card_bg']} !important; 
        padding: 15px; 
        border-radius: 12px; 
        border: 1px solid {current_theme['card_border']}; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    }}
    [data-testid="stMetricValue"] {{
        color: {current_theme['metric_val']} !important;
    }}
    [data-testid="stMetricLabel"] {{
        color: {current_theme['text']} !important;
        opacity: 0.8;
    }}
    
    /* Text Colors */
    h1, h2, h3, p, span, div {{
        color: {current_theme['text']};
        font-family: 'Helvetica Neue', sans-serif;
    }}
    
    /* Input Fields */
    .stTextInput > div > div > input {{
        color: {current_theme['text']};
        background-color: {current_theme['secondary_bg']};
    }}
</style>
"""
st.markdown(theme_css, unsafe_allow_html=True)

# --- Particle Background (Cool Effect) ---
# Injects a lightweight particle.js effect
particles_html = f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    #particles-js {{
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: -1; /* Behind everything */
      pointer-events: none; /* Don't block clicks */
    }}
  </style>
</head>
<body>
  <div id="particles-js"></div>
  <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
  <script>
    particlesJS("particles-js", {{
      "particles": {{
        "number": {{ "value": 60, "density": {{ "enable": true, "value_area": 800 }} }},
        "color": {{ "value": "{'#ffffff' if st.session_state.theme == 'dark' else '#4cc9f0'}" }},
        "shape": {{ "type": "circle" }},
        "opacity": {{ "value": 0.3, "random": false }},
        "size": {{ "value": 3, "random": true }},
        "line_linked": {{ "enable": true, "distance": 150, "color": "{'#ffffff' if st.session_state.theme == 'dark' else '#4cc9f0'}", "opacity": 0.2, "width": 1 }},
        "move": {{ "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }}
      }},
      "interactivity": {{
        "detect_on": "canvas",
        "events": {{ "onhover": {{ "enable": false }}, "onclick": {{ "enable": false }}, "resize": true }}
      }},
      "retina_detect": true
    }});
  </script>
</body>
</html>
"""
components.html(particles_html, height=0, width=0) # Hidden iframe but injects fixed bg

# --- Top Bar: Language & Theme Toggle ---
# Using columns to place buttons at top right
col_title, col_toggles = st.columns([5, 1])

with col_toggles:
    # Use a container to group buttons close together
    with st.container():
        # Language Toggle
        c_lang, c_theme = st.columns(2)
        with c_lang:
            if st.button("🌐 " + ("CN" if st.session_state.lang == 'en' else "EN"), help="Switch Language"):
                st.session_state.lang = 'zh' if st.session_state.lang == 'en' else 'en'
                st.rerun()
        
        # Theme Toggle
        with c_theme:
            theme_icon = "🌙" if st.session_state.theme == 'light' else "☀️"
            if st.button(theme_icon, help="Toggle Light/Dark Mode"):
                st.session_state.theme = 'dark' if st.session_state.theme == 'light' else 'light'
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
    
    st.markdown("---")
    st.markdown(t('privacy_header'))
    st.caption(t('privacy_caption'))

# --- 数据加载与持久化逻辑 ---
lines = []
timestamps = []
sources = []

# Logic:
# 1. If user uploads a new file, process it and save to session_state.
# 2. If user clicks a button (rerun) but didn't change file, load from session_state.
# 3. If session_state is empty and no file, show hint.

if up:
    # New file uploaded or file still present in uploader
    # We use file content hash or name to detect change if needed, but simple re-read is fine
    try:
        content = up.read().decode('utf-8', errors='ignore')
        
        # Parse Logic
        new_lines = []
        new_timestamps = []
        new_sources = []
        
        # 1. 尝试解析新版插件 JSON [{ts, text, src}, ...]
        if up.name.endswith('.json'):
            try:
                data = json.loads(content)
                if isinstance(data, list) and len(data) > 0:
                    if 'text' in data[0]: 
                        for item in data:
                            text = item.get('text', '')
                            if exclude_short and len(text) < 5: continue
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

        # 2. 兼容旧版 TXT / JSONL
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

        # Update Session State
        if new_lines:
            st.session_state.cached_data = {
                'lines': new_lines,
                'timestamps': new_timestamps,
                'sources': new_sources
            }
            
    except Exception as e:
        st.error(t('upload_error').format(e))

# Load from Cache if available
if st.session_state.cached_data:
    lines = st.session_state.cached_data['lines']
    timestamps = st.session_state.cached_data['timestamps']
    sources = st.session_state.cached_data['sources']

if not lines:
    st.info(t('upload_hint'))
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

# --- 核心算法：复杂度评分 (Complexity Score) ---
def calculate_complexity(text):
    """
    计算 Prompt 的思维复杂度 (0-100)
    """
    score = 0
    score += min(len(text) / 200, 1.0) * 40
    logical_words = [
        'if', 'because', 'however', 'therefore', 'although', 'compare', 'difference',
        '如果', '因为', '但是', '所以', '虽然', '比较', '区别', '原理', '分析', 'why', 'how'
    ]
    logic_hits = sum(1 for w in logical_words if w in text.lower())
    score += min(logic_hits / 3, 1.0) * 30
    if '```' in text or '\n-' in text or '\n1.' in text:
        score += 30
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
    en_words = [w for w in en_words if w not in english_stops]
    
    return zh_words + en_words

words = process_tokens(lines)
word_counts = Counter(words)

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
tab_insight, tab_habit, tab_data = st.tabs([t('tab_insight'), t('tab_habit'), t('tab_data')])

# === Tab 1: 思维洞察 ===
with tab_insight:
    col_radar, col_cloud = st.columns([1, 1.5])
    
    # Advanced Plotly Template (Cyberpunk Style)
    chart_template = "plotly_dark" if st.session_state.theme == 'dark' else "plotly_white"
    accent_color = "#4cc9f0" if st.session_state.theme == 'dark' else "#3a86ff"
    
    with col_radar:
        st.subheader(t('radar_header'))
        
        category_defs = {
            "coding": {
                "keywords": ["代码", "code", "函数", "报错", "bug", "python", "js", "react", "sql", "api", "写一个", "实现", "function", "class", "error", "接口"],
                "label_en": "Coding",
                "label_zh": "💻 编程开发"
            },
            "writing": {
                "keywords": ["文案", "文章", "周报", "总结", "扩写", "润色", "大纲", "标题", "翻译", "邮件", "write", "email", "article", "summary", "translate", "outline", "title"],
                "label_en": "Writing",
                "label_zh": "📝 内容创作"
            },
            "logic": {
                "keywords": ["分析", "原因", "区别", "比较", "评价", "优缺点", "建议", "方案", "思维导图", "analyze", "reason", "compare", "difference", "pros", "cons", "plan"],
                "label_en": "Logic",
                "label_zh": "🧠 逻辑分析"
            },
            "learning": {
                "keywords": ["解释", "介绍", "是什么", "含义", "原理", "教程", "学习", "如何", "explain", "what", "how", "meaning", "tutorial", "principle", "learn"],
                "label_en": "Learning",
                "label_zh": "🎓 知识学习"
            },
            "creative": {
                "keywords": ["创意", "点子", "故事", "设想", "如果", "生成", "设计", "idea", "story", "design", "imagine", "generate", "create"],
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
        
        fig_radar = px.line_polar(r=normalized_vals, theta=labels, line_close=True, template=chart_template)
        fig_radar.update_traces(fill='toself', line_color=accent_color)
        fig_radar.update_layout(
            polar=dict(radialaxis=dict(visible=False)),
            margin=dict(t=20, b=20, l=30, r=30),
            height=350,
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)'
        )
        st.plotly_chart(fig_radar, use_container_width=True)

    with col_cloud:
        st.subheader(t('cloud_header'))
        if words:
            wc = WordCloud(font_path=font_path, width=800, height=500, 
                          background_color=None, mode="RGBA", # 透明背景
                          max_words=100, collocations=False).generate(" ".join(words))
            st.image(wc.to_array(), use_column_width=True)
        else:
            st.warning(t('cloud_warning'))

    st.subheader(t('dist_header'))
    c_len, c_comp = st.columns(2)
    
    with c_len:
        fig_len = px.histogram(
             df, x="len", nbins=30,
             title=t('dist_len_title'),
             labels={'len': t('dist_len_label'), 'count': t('count_label')},
             color_discrete_sequence=['#ffbe0b'],
             template=chart_template
        )
        fig_len.update_layout(showlegend=False, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_len, use_container_width=True)

    with c_comp:
        fig_comp = px.histogram(
            df, x="complexity", nbins=20, 
            title=t('dist_comp_title'),
            labels={'complexity': t('dist_comp_label'), 'count': t('count_label')},
            color_discrete_sequence=['#7209b7'],
            template=chart_template
        )
        fig_comp.update_layout(bargap=0.1, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_comp, use_container_width=True)

    # 恢复高频词组 (Bigrams) 板块
    st.divider()
    st.subheader(t('phrases_header'))
    
    bigrams = []
    for line in lines:
        # 简单分词用于 bigram
        line_words = [w for w in jieba.lcut(line) if len(w) > 1 and re.match(r"[\u4e00-\u9fa5a-zA-Z]", w)]
        if len(line_words) >= 2:
            for i in range(len(line_words)-1):
                bigrams.append(f"{line_words[i]} {line_words[i+1]}")

    top_bigrams = Counter(bigrams).most_common(12)

    cols = st.columns(4)
    for i, (phrase, count) in enumerate(top_bigrams):
        with cols[i % 4]:
            st.button(f"{phrase} ({count})", key=f"bi_{i}", disabled=True)


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
                              color='count', color_continuous_scale='Blues', template=chart_template)
            fig_trend.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
            st.plotly_chart(fig_trend, use_container_width=True)
            
        with c2:
            st.caption(t('hour_caption'))
            hour_counts = df['hour'].value_counts().sort_index().reset_index()
            hour_counts.columns = ['hour', 'count']
            
            tab_bar, tab_line = st.tabs([t('tab_bar'), t('tab_line')])
            
            with tab_bar:
                fig_bar = px.bar(
                    hour_counts, x='hour', y='count',
                    labels={'hour': t('hour_label'), 'count': t('count_label')},
                    template=chart_template
                )
                fig_bar.update_traces(marker_color=accent_color)
                fig_bar.update_layout(xaxis=dict(tickmode='linear', dtick=2), paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
                st.plotly_chart(fig_bar, use_container_width=True)
                
            with tab_line:
                fig_hour = px.line(hour_counts, x='hour', y='count', markers=True, template=chart_template)
                fig_hour.update_traces(line_color='#f72585')
                fig_hour.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
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
