import streamlit as st
import pandas as pd
import jieba
import re
import json
import numpy as np
from wordcloud import WordCloud
from collections import Counter
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go

# 页面配置
st.set_page_config(page_title="SPR - 你的 Prompt 画像", layout="wide", page_icon="🔮")

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

# --- CSS 美化 ---
st.markdown("""
<style>
    .main .block-container { padding-top: 2rem; }
    h1 { color: #2c3e50; }
    h3 { color: #34495e; font-size: 1.2rem; }
    .stMetric { background-color: #f8f9fa; padding: 15px; border-radius: 12px; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .stDataFrame { border-radius: 10px; overflow: hidden; border: 1px solid #eee; }
</style>
""", unsafe_allow_html=True)

st.title("🔮 SPR 镜像版：看见你的思维习惯")

# 侧边栏：上传
with st.sidebar:
    st.header("📤 数据导入")
    st.info("请使用 Chrome 插件导出的 `my_prompts.json` 文件")
    up = st.file_uploader("拖入文件", type=["json", "txt", "jsonl"])
    
    st.markdown("---")
    st.markdown("### 隐私说明")
    st.caption("所有计算均在本地完成，数据不上传云端。")

# 数据加载逻辑
lines = []
timestamps = []
sources = []

if up:
    try:
        content = up.read().decode('utf-8', errors='ignore')
        
        # 1. 尝试解析新版插件 JSON [{ts, text, src}, ...]
        if up.name.endswith('.json'):
            try:
                data = json.loads(content)
                if isinstance(data, list) and len(data) > 0:
                    # 检查是不是插件格式
                    if 'text' in data[0]: 
                        for item in data:
                            lines.append(item.get('text', ''))
                            ts = item.get('ts', 0)
                            if ts > 0: timestamps.append(datetime.fromtimestamp(ts / 1000))
                            sources.append(item.get('src', 'unknown'))
                    # 兼容 ChatGPT 官方导出
                    elif 'mapping' in data[0]:
                         for conv in data:
                            if 'mapping' in conv:
                                for k, v in conv['mapping'].items():
                                    if v['message'] and v['message']['author']['role'] == 'user':
                                        parts = v['message']['content']['parts']
                                        if parts: 
                                            lines.append(str(parts[0]))
                                            # 官方导出包含 create_time
                                            ct = v['message'].get('create_time')
                                            if ct: timestamps.append(datetime.fromtimestamp(ct))
            except json.JSONDecodeError:
                pass # 可能是其他格式

        # 2. 兼容旧版 TXT / JSONL
        if not lines: 
             if up.name.endswith('.jsonl'):
                for line in content.splitlines():
                    if line.strip():
                        try:
                            msg = json.loads(line)
                            if 'messages' in msg: lines.append(msg['messages'][0]['content'])
                        except: pass
             else:
                lines = [l.strip() for l in content.split('===SPLIT===') if l.strip()]
                if len(lines) < 2:
                     lines = [l.strip() for l in content.splitlines() if l.strip()]

    except Exception as e:
        st.error(f"解析失败: {e}")

if not lines:
    st.info("👈 请先在左侧上传数据")
    st.stop()

# --- 数据预处理 ---
df = pd.DataFrame({"prompt": lines})
df["len"] = df["prompt"].str.len()
if timestamps and len(timestamps) == len(lines):
    df["time"] = timestamps
    df["hour"] = df["time"].dt.hour
    df["date"] = df["time"].dt.date
    has_time = True
else:
    has_time = False

# 分词
def get_words(text):
    return [w for w in jieba.lcut(text) if len(w) > 1 and re.match(r"[\u4e00-\u9fa5a-zA-Z]", w)]

all_text = " ".join(lines)
words = get_words(all_text)
word_counts = Counter(words)

# --- 核心指标 ---
c1, c2, c3, c4 = st.columns(4)
c1.metric("累计 Prompt", f"{len(df)} 条", delta=f"近7天 {len(df[df['time'] > pd.Timestamp.now() - pd.Timedelta(days=7)])} 条" if has_time else None)
c2.metric("平均长度", f"{int(df['len'].mean())} 字")
c3.metric("总词汇量", f"{len(word_counts)} 个")
most_common_word = word_counts.most_common(1)[0][0] if word_counts else "无"
c4.metric("最爱用的词", most_common_word)

st.divider()

# --- Tab 布局 ---
tab_visual, tab_data = st.tabs(["📊 可视化分析", "📋 原始数据表"])

with tab_visual:
    # --- 第一排：词云 & 人格雷达 ---
    col_cloud, col_radar = st.columns([1.5, 1])

    with col_cloud:
        st.subheader("☁️ 你的思维词云")
        
        wc = WordCloud(font_path=font_path, width=800, height=500, background_color="white", 
                       max_words=100, collocations=False).generate(" ".join(words))
        st.image(wc.to_array(), use_column_width=True)

    with col_radar:
        st.subheader("🕸️ Prompt 人格雷达")
        
        # 简单的关键词分类器
        categories = {
            "💻 编程开发": ["代码", "code", "函数", "报错", "bug", "python", "js", "react", "sql", "api", "写一个", "实现"],
            "📝 内容创作": ["文案", "文章", "周报", "总结", "扩写", "润色", "大纲", "标题", "翻译", "邮件"],
            "🧠 逻辑分析": ["分析", "原因", "区别", "比较", "评价", "优缺点", "建议", "方案", "思维导图"],
            "🎓 知识学习": ["解释", "介绍", "是什么", "含义", "原理", "教程", "学习", "如何"],
            "🎨 创意脑暴": ["创意", "点子", "故事", "设想", "如果", "生成", "设计"]
        }
        
        scores = {k: 0 for k in categories}
        for w in words:
            w_lower = w.lower()
            for cat, keywords in categories.items():
                if w_lower in keywords:
                    scores[cat] += 1
        
        # 归一化
        total_score = sum(scores.values()) or 1
        labels = list(scores.keys())
        values = [s/total_score for s in scores.values()]
        
        # Plotly 雷达图
        fig_radar = px.line_polar(r=values, theta=labels, line_close=True)
        fig_radar.update_traces(fill='toself', line_color='#fb5607')
        fig_radar.update_layout(
            polar=dict(radialaxis=dict(visible=False, range=[0, max(values)*1.1])),
            margin=dict(t=20, b=20, l=40, r=40),
            height=400
        )
        st.plotly_chart(fig_radar, use_container_width=True)

    st.divider()

    # --- 第二排：时间分布 & 长度分布 ---
    if has_time:
        st.subheader("📅 你的活跃时段")
        c_time, c_len = st.columns([2, 1])
        
        with c_time:
            hour_counts = df['hour'].value_counts().sort_index()
            # 补全 24 小时
            for h in range(24):
                if h not in hour_counts: hour_counts[h] = 0
            hour_counts = hour_counts.sort_index()
            
            # Plotly 柱状图
            fig_time = px.bar(
                x=hour_counts.index, 
                y=hour_counts.values,
                labels={'x': '小时 (0-23)', 'y': 'Prompt 数量'},
                title="24小时活跃度热力"
            )
            fig_time.update_traces(marker_color='#3a86ff', hovertemplate="时间: %{x}点<br>数量: %{y}条")
            fig_time.update_layout(xaxis=dict(tickmode='linear', dtick=2))
            st.plotly_chart(fig_time, use_container_width=True)
            
        with c_len:
             # Plotly 直方图
             fig_len = px.histogram(
                 df, x="len", nbins=30,
                 title="Prompt 长度分布",
                 labels={'len': '字符数'},
                 color_discrete_sequence=['#ffbe0b']
             )
             fig_len.update_layout(showlegend=False)
             st.plotly_chart(fig_len, use_container_width=True)

    else:
        st.warning("⚠️ 当前数据不包含时间信息，无法显示活跃时段分析。请使用新版插件重新导出 JSON。")
        st.subheader("📏 Prompt 长度分布")
        fig_len = px.histogram(df, x="len", nbins=30, color_discrete_sequence=['#ffbe0b'])
        st.plotly_chart(fig_len, use_container_width=True)

    # --- 底部：高频词组 (Bigrams) ---
    st.divider()
    st.subheader("🔗 你最爱用的短语 (Top Phrases)")

    # 简单的 Bigram 实现
    bigrams = []
    for line in lines:
        line_words = get_words(line)
        if len(line_words) >= 2:
            for i in range(len(line_words)-1):
                bigrams.append(f"{line_words[i]} {line_words[i+1]}")

    top_bigrams = Counter(bigrams).most_common(12)

    cols = st.columns(4)
    for i, (phrase, count) in enumerate(top_bigrams):
        with cols[i % 4]:
            st.button(f"{phrase} ({count})", key=f"bi_{i}", disabled=True)

with tab_data:
    st.subheader("📋 Prompt 详情表")
    
    # 搜索框
    search_term = st.text_input("🔍 搜索 Prompt 内容", "")
    
    # 构建展示用的 DataFrame
    display_df = df.copy()
    if has_time:
        display_df['time_str'] = display_df['time'].dt.strftime('%Y-%m-%d %H:%M')
        display_cols = ['time_str', 'prompt', 'len']
        col_config = {
            "time_str": st.column_config.TextColumn("时间", width="medium"),
            "prompt": st.column_config.TextColumn("内容", width="large"),
            "len": st.column_config.NumberColumn("长度", width="small")
        }
    else:
        display_cols = ['prompt', 'len']
        col_config = {
            "prompt": st.column_config.TextColumn("内容", width="large"),
            "len": st.column_config.NumberColumn("长度", width="small")
        }
    
    # 过滤
    if search_term:
        display_df = display_df[display_df['prompt'].str.contains(search_term, case=False)]
    
    st.dataframe(
        display_df[display_cols], 
        column_config=col_config,
        use_container_width=True,
        height=600,
        hide_index=True
    )
