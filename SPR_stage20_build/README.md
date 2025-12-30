# Self Prompt Learner (SPR) - Mirror Edition

这是一个帮你「看见」自己 Prompt 习惯的极简工具。不评分、不竞赛、不联网，只做你的镜子。

## 1. 安装 Chrome 插件 (收集数据)

1. 打开 Chrome 浏览器，输入 `chrome://extensions/` 并回车。
2. 打开右上角「开发者模式」。
3. 点击「加载已解压的扩展程序」，选择本项目下的 `chrome-extension` 文件夹。
4. 现在，当你复制文本或使用 ChatGPT 时，Prompt 会被自动记录。

## 2. 启动可视化镜像 (查看画像)

```bash
# 安装依赖 (仅需一次)
pip install -r requirements.txt

# 启动
streamlit run mirror/prompt_mirror.py
```

在打开的网页中：
1. 点击插件图标 -> 「导出文本」。
2. 将下载的文件拖入网页。
3. 即刻查看你的高频词、长度分布与情绪倾向。

## 隐私声明

- 所有数据仅存储在你本地浏览器和本地文件。
- 不会上传任何内容到云端。
