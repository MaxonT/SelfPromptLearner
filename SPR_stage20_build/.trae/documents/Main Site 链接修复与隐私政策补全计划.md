# 1. 修复 Main Site 链接

* **目标**：将本地调试地址替换为正式部署的 Streamlit Cloud 地址。

* **文件**：`chrome-extension/popup.js`

* **改动**：

  * 将 `http://localhost:8501/` 替换为 `https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app`

  * 保留 `?lang=` 参数传递逻辑。

# 2. 补全隐私政策 (Privacy Policy)

* **目标**：创建缺失的隐私政策页面，并修复底部链接点击无效的问题。

* **文件**：

  * 新建 `chrome-extension/privacy.html`：包含用户提供的隐私条款文本，并添加适配扩展风格的 CSS 样式（支持暗色/亮色模式）。

  * 修改 `chrome-extension/popup.js`：为底部的 "Privacy Policy" 链接添加点击事件，使其在**新标签页**中打开 `privacy.html`。

* **验证**：

  * 点击 Main Site 图标 -> 跳转到 Streamlit App。

  * 点击 Privacy Policy 链接 -> 打开扩展内置的隐私政策页面。

