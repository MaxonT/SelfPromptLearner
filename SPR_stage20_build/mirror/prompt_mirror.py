import streamlit as st
import pandas as pd
import jieba
import re
import json
import matplotlib.pyplot as plt
import numpy as np
from wordcloud import WordCloud
from collections import Counter
from datetime import datetime

# --- 字体处理 (Mac 乱码终结版) ---
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
    return None # Win/Linux 需另外处理，暂时 fallback

font_path = get_chinese_font()
# 设置 Matplotlib 字体以支持中文
if platform.system() == "Darwin":
    plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'Heiti TC', 'PingFang SC']
else:
    plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei']
plt.rcParams['axes.unicode_minus'] = False
# --------------------------------

# 页面配置
st.set_page_config(page_title="SPR - 你的 Prompt 画像", layout="wide", page_icon="🔮")

st.markdown("""
<style>
    .main .block-container { padding-top: 2rem; }
    h1 { color: #2c3e50; }
    h3 { color: #34495e; font-size: 1.2rem; }
    .stMetric { background-color: #f8f9fa; padding: 10px; border-radius: 8px; border: 1px solid #eee; }
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
c1.metric("累计 Prompt", f"{len(df)} 条")
c2.metric("平均长度", f"{int(df['len'].mean())} 字")
c3.metric("总词汇量", f"{len(word_counts)} 个")
most_common_word = word_counts.most_common(1)[0][0] if word_counts else "无"
c4.metric("最爱用的词", most_common_word)

st.divider()

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
    # 闭合雷达图
    values.append(values[0])
    angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False).tolist()
    angles.append(angles[0])
    
    fig_radar = plt.figure(figsize=(4, 4), facecolor='#f8f9fa')
    ax = fig_radar.add_subplot(111, polar=True, facecolor='#f8f9fa')
    ax.plot(angles, values, 'o-', linewidth=2, color='#fb5607')
    ax.fill(angles, values, alpha=0.25, color='#fb5607')
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, fontsize=10)
    # 隐藏y轴刻度
    ax.set_yticklabels([])
    ax.spines['polar'].set_visible(False)
    st.pyplot(fig_radar)

st.divider()

# --- 第二排：时间分布 & 长度分布 ---
if has_time:
    st.subheader("📅 你的活跃时段")
    c_time, c_len = st.columns(2)
    
    with c_time:
        hour_counts = df['hour'].value_counts().sort_index()
        # 补全 24 小时
        for h in range(24):
            if h not in hour_counts: hour_counts[h] = 0
        hour_counts = hour_counts.sort_index()
        
        fig_time, ax_time = plt.subplots(figsize=(10, 4))
        ax_time.bar(hour_counts.index, hour_counts.values, color='#3a86ff', alpha=0.7)
        ax_time.set_xticks(range(0, 24, 2))
        ax_time.set_xlabel("小时 (0-23)")
        ax_time.set_ylabel("Prompt 数量")
        ax_time.set_title("24小时活跃度热力")
        ax_time.spines['top'].set_visible(False)
        ax_time.spines['right'].set_visible(False)
        st.pyplot(fig_time)
        
    with c_len:
         fig_len, ax_len = plt.subplots(figsize=(10, 4))
         ax_len.hist(df["len"], bins=30, color="#ffbe0b", alpha=0.8)
         ax_len.set_title("Prompt 长度分布")
         ax_len.set_xlabel("字符数")
         ax_len.spines['top'].set_visible(False)
         ax_len.spines['right'].set_visible(False)
         st.pyplot(fig_len)

else:
    st.warning("⚠️ 当前数据不包含时间信息，无法显示活跃时段分析。请使用新版插件重新导出 JSON。")
    st.subheader("📏 Prompt 长度分布")
    fig_len, ax_len = plt.subplots(figsize=(10, 4))
    ax_len.hist(df["len"], bins=30, color="#ffbe0b", alpha=0.8)
    st.pyplot(fig_len)

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

st.caption("基于 Jieba 分词的二元词组统计")
