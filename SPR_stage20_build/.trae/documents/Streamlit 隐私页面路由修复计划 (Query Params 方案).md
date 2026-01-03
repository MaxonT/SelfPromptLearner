# 1. 立即优化方案：Query Params 单文件路由

由于 Streamlit Cloud 部署的多页面路由 (`pages/`) 可能存在配置兼容性问题，导致用户访问 `/Privacy_Policy` 时被重定向回主页。为了确保**绝对可靠**的访问，我们将采用 **Query Parameter 路由** 方案。

*   **URL 形式**：`https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/?page=privacy`
*   **原理**：在主入口文件 `prompt_mirror.py` 中直接检查 URL 参数，如果 `page=privacy`，则只渲染隐私政策内容，**不加载**主页面的任何其他组件。
*   **优势**：
    *   **100% 可靠**：只要主页能打开，隐私页面就能打开，无需担心文件路径、部署根目录等问题。
    *   **无缝集成**：用户体验上与独立页面无异。
    *   **合规**：完全满足 Google Extension Store 要求提供有效隐私政策 URL 的规定。

# 2. 执行步骤

1.  **修改 `mirror/prompt_mirror.py`**：
    *   在脚本最开头（`st.set_page_config` 之后）添加路由逻辑。
    *   如果检测到 `?page=privacy`，调用 `show_privacy_page()` 函数并 `st.stop()`，阻止主页代码执行。
    *   将之前生成的 `mirror/pages/Privacy_Policy.py` 中的内容封装进 `show_privacy_page()` 函数。

2.  **更新 Chrome Extension 链接**：
    *   修改 `chrome-extension/popup.js`，将隐私政策链接更新为 `https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/?page=privacy`。

3.  **清理旧文件**：
    *   删除 `mirror/pages/Privacy_Policy.py` 以免混淆。

4.  **提供新的 Store URL**：
    *   在 Streamlit 左侧栏更新提示，告知用户复制新的 URL。

这个方案将立即解决重定向问题，确保你在 Google Extension Store 提交时拥有一个稳定、有效的隐私政策链接。