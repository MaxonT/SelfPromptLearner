1. 一次性 git rm -rf 删除旧目录：src/ prompts/ scripts/ examples/ tests/ 及旧 README
2. 新建 chrome-extension/ 目录，含 manifest.json、background.js、content.js、popup.html、icons/
3. 新建 mirror/prompt\_mirror.py（30 行 Streamlit，接收插件数据→词云+三图+CSV 下载）
4. 新建顶层 requirements.txt（5 个库）、README.md（3 步装插件+1 步运行）、.gitignore
5. git add . && git commit -m "chore: 全砍竞赛逻辑，换 Prompt 自画像插件+镜像"
6. 终端验证：streamlit

