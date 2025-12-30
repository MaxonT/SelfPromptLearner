# Main Site 部署与联动计划

## 核心澄清
是的，目前的 Streamlit 页面 (`localhost:8501`) 就是我们的 **Main Site**（主站/驾驶舱）。
要让它变成真正的「个人网站」，我们需要解决两个问题：
1.  **部署 (Deployment)**：让它在公网可访问，而不只是在你自己电脑上跑。
2.  **联动 (Linkage)**：插件弹窗里加一个按钮，一键跳到这个网站。

## 1. 部署方案：Streamlit Cloud (最快、免费、最稳)
*   **为什么选它**：
    *   **零运维**：不需要买服务器、配 Nginx、搞 Docker。
    *   **GitHub 联动**：只要把你现在的代码推送到 GitHub，它自动部署。
    *   **HTTPS**：自动送你一个 `https://share.streamlit.io/yourname/spr` 的域名。
*   **静态站行不行？**：**不行**。因为 Streamlit 是 Python 写的，需要后端跑 Python 运行时，不能部署成纯静态 HTML (GitHub Pages/Vercel)。Streamlit Cloud 是专门跑这种 Python App 的最佳选择。

## 2. 插件联动 (Extension Update)
*   **新增按钮**：在插件 Header 的右上角（扫描按钮旁边），加一个「跳转主站」的图标（External Link）。
*   **动态 URL**：
    *   默认跳到 `http://localhost:8501`（开发模式）。
    *   允许用户在插件设置里填入自己的 Streamlit Cloud 网址。

## 3. 隐私与数据流 (Privacy Challenge)
*   **挑战**：如果部署到公网，怎么把插件抓到的数据传上去？
*   **方案 A (手动)**：继续用「插件导出 JSON -> 网页拖入上传」。**最安全，最简单**。
*   **方案 B (自动)**：需要搞数据库 (Supabase/Firebase)，复杂度指数级上升，且涉及用户隐私。
*   **建议**：**先保持方案 A**。主站只负责「深度分析」，数据传输靠文件中转。这样我们不需要维护数据库，用户数据永远在他自己手里。

## 执行步骤
1.  **代码准备**：把现在的 `prompt_mirror.py` 整理好，生成标准的 `requirements.txt`（已完成）。
2.  **插件更新**：修改 `popup.html` 加跳转按钮。
3.  **部署指引**：写一份 `DEPLOY.md`，教你怎么把这个仓库推到 GitHub 并一键部署到 Streamlit Cloud。

**同意先走「Streamlit Cloud 部署 + 手动上传」路线吗？这是最快上线个人主站的路径。**
