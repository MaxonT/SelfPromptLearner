import streamlit as st
import pandas as pd
import jieba
import re
import io
import matplotlib.pyplot as plt
from wordcloud import WordCloud
from collections import Counter
import streamlit.components.v1 as components

# 页面配置
st.set_page_config(page_title="我的 Prompt 画像", layout="centered")
st.title("📊 我的 Prompt 自画像")

# 1. 注入 JS 接收插件数据
components.html("""
<button id="load" style="background:#4CAF50;color:white;padding:10px 20px;border:none;border-radius:4px;cursor:pointer;font-size:16px;">🔄 从插件导入数据</button>
<span id="status" style="margin-left:10px;color:#666;"></span>
<script>
document.getElementById('load').onclick = async () => {
  try {
    const { prompts } = await chrome.storage.local.get('prompts');
    if (!prompts || prompts.length === 0) {
        document.getElementById('status').innerText = '未找到数据，请先使用插件收集';
        return;
    }
    const texts = prompts.map(p => p.text).join('\\n===SPLIT===\\n');
    window.parent.postMessage({type: 'setPrompts', texts: texts}, '*');
    document.getElementById('status').innerText = `已导入 ${prompts.length} 条`;
  } catch (e) {
    document.getElementById('status').innerText = '请在 Chrome 中安装插件后使用';
  }
};
</script>
""", height=80)

# 2. 接收数据（Streamlit 无法直接读 postMessage，这里提供备用手动入口 + 说明）
# 注意：Streamlit 原生不支持直接从前端 JS 传变量给 Python 后端而不刷新。
# 为了最简 MVP，我们保留“拖入文件”作为兜底，同时把“从插件导入”做成剪贴板中转或者提示。
# 修正方案：由于 Chrome Extension 无法直接跨域写 Streamlit 页面，最稳妥的 MVP 是：
# 插件 -> 导出 txt -> 用户拖入 txt。上面的 JS 按钮更多是演示或需配合 userscript。
# 为了“零粘贴”体验，我们可以让 JS 把内容写入剪贴板，然后 Python 读剪贴板（如果部署在本地）。
# 但最稳妥的还是文件拖拽。我们先保留文件拖拽作为核心。

st.info("💡 使用方式：在浏览器点击插件图标 -> [导出文本] -> 将下载的 txt 拖入下方")

up = st.file_uploader("上传导出的 txt/json/jsonl", type=["txt", "json", "jsonl"])
lines = []

if up:
    try:
        content = up.read().decode('utf-8', errors='ignore')
        if up.name.endswith('.json'):
            import json
            data = json.loads(content)
            # 适配 ChatGPT 导出格式
            if isinstance(data, list):
                for conv in data:
                    if 'mapping' in conv:
                        for k, v in conv['mapping'].items():
                            if v['message'] and v['message']['author']['role'] == 'user':
                                parts = v['message']['content']['parts']
                                if parts: lines.append(str(parts[0]))
        elif up.name.endswith('.jsonl'):
            import json
            for line in content.splitlines():
                if line.strip():
                    try:
                        msg = json.loads(line)
                        if 'messages' in msg:
                            lines.append(msg['messages'][0]['content'])
                    except: pass
        else:
            # 默认 txt，按行或分隔符
            lines = [l.strip() for l in content.split('===SPLIT===') if l.strip()]
            if len(lines) < 2: # 可能是普通按行
                 lines = [l.strip() for l in content.splitlines() if l.strip()]
    except Exception as e:
        st.error(f"解析失败: {e}")

if not lines:
    st.warning("👈 请先上传数据以生成画像")
    st.stop()

# 3. 统计分析
df = pd.DataFrame({"prompt": lines})
df["len"] = df["prompt"].str.len()
df["words"] = df["prompt"].apply(lambda x: len(jieba.lcut(x)))
df["?"] = df["prompt"].str.count(r"\?|？")
df["!"] = df["prompt"].str.count(r"\!|！")

# 4. 词云
all_text = " ".join(lines)
words = [w for w in jieba.lcut(all_text) if len(w) > 1 and re.match(r"[\u4e00-\u9fa5a-zA-Z]", w)]
# 字体兜底：Mac 默认 PingFang，Linux/Win 可能需要 fallback
font_path = "PingFang.ttc"
try:
    open(font_path)
except:
    font_path = None # WordCloud 会用默认

wc = WordCloud(font_path=font_path, width=800, height=400, background_color="white", collocations=False).generate(" ".join(words))

st.image(wc.to_array(), use_column_width=True)

# 5. 图表
fig, ax = plt.subplots(1, 3, figsize=(15, 4))

# Top 20 词
top_words = Counter(words).most_common(20)
if top_words:
    ax[0].barh([x[0] for x in top_words[::-1]], [x[1] for x in top_words[::-1]], color="#79bd9a")
    ax[0].set_title("Top 20 高频词")
    # 解决中文乱码问题（简单处理）
    plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei'] 

# 长度分布
ax[1].hist(df["len"], bins=20, color="#ffbe0b")
ax[1].set_title("Prompt 长度分布")

# 情绪分布
ax[2].scatter(df["?"], df["!"], alpha=0.6, color="#fb5607")
ax[2].set_xlabel("问号数量")
ax[2].set_ylabel("感叹号数量")
ax[2].set_title("情绪分布 (疑问 vs 强烈)")

st.pyplot(fig)

# 6. 下载
csv = df.to_csv(index=False).encode('utf-8-sig')
st.download_button("📥 下载分析结果 CSV", csv, "prompt_analysis.csv", "text/csv")
