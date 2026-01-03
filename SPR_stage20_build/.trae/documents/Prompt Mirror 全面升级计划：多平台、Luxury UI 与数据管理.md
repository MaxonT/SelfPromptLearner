# 1. 多平台支持 (Chrome Extension)
## 目标
打破仅支持 ChatGPT 的限制，支持 Claude, Gemini, Codex 等平台。

## 实现细节
1.  **Manifest 更新**:
    *   修改 `manifest.json`，在 `host_permissions` 和 `content_scripts` 中添加 `*.claude.ai`, `*.gemini.google.com`, `platform.openai.com` 等域名。
2.  **智能抓取逻辑 (content.js)**:
    *   重构 `extract` 函数，根据 `window.location.hostname` 自动切换抓取策略。
    *   **Claude**: 适配 `.font-user-message` 等选择器。
    *   **Gemini/Codex**: 适配其特定的 DOM 结构。
    *   **通用回退**: 尝试抓取通用的 `[data-role="user"]` 属性，确保对未知平台也有一定兼容性。

# 2. 视觉与体验升级 (UI/UX)
## 目标
解决 "Undefined" 显示问题，统一 "Luxury" 风格，并优化交互细节。

## 实现细节
1.  **修复 Undefined & 统一风格**:
    *   **Streamlit**: 确保所有 `luxury_chart` 调用都包含 `title` 参数。
    *   **Extension**: 重写 `style.css` 和 `popup.html`，引入 Streamlit 同款的 "深蓝黑渐变 + 香槟金文本 + 磨砂玻璃" 风格。
2.  **优化 Top Phrases**:
    *   不再使用简单的按钮。
    *   根据词频计算透明度 (`opacity`)，使用 HTML/CSS 渲染带深浅变化的金色标签，频率越高颜色越深。
3.  **优化文件上传**:
    *   增大 Streamlit 侧边栏上传框的 `padding` 和 `border`，增加明显的 Hover 效果和文字提示，使其不容错过。

# 3. 数据管理 (Manage Data)
## 目标
赋予用户查看详情和删除数据的能力。

## 实现细节
1.  **Streamlit**:
    *   新增 "🗂️ Data Manager" 标签页。
    *   使用 `st.data_editor` 展示所有 Prompt，提供 "Select to Delete" 功能，允许用户批量删除不需要的记录。
2.  **Extension**:
    *   在 `popup.html` 底部添加 "Manage Data" 入口。
    *   点击后进入二级页面 (在 Popup 内)，列出最近 Prompt，提供单条删除功能。

# 4. 隐私与过滤 (Privacy & Filter)
## 目标
增强合规性与数据纯净度。

## 实现细节
1.  **Privacy/Legal**:
    *   在 Streamlit 侧边栏底部添加 "Privacy & Legal" 折叠卡片，明确声明 "Local Processing Only" (仅本地处理)。
2.  **增强过滤 (Filter)**:
    *   在 Streamlit 设置中增加 "Strict Filtering" (严格过滤) 开关。
    *   开启后，自动过滤纯数字、极短文本 (<5 chars) 以及包含 "test", "hello" 等无意义词汇的 Prompt。
