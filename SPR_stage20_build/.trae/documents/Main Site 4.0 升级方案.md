# Main Site 4.0 升级方案：极致体验与深度国际化

我们将在保持现有功能的基础上，大幅提升视觉质感、交互体验和国际化深度。

## 1. 核心问题修复与体验升级 (Experience Fixes)

*   **数据持久化 (State Persistence)**:
    *   **问题**: 切换语言/主题导致页面刷新，上传的数据丢失。
    *   **方案**: 利用 `st.session_state` 缓存上传的 DataFrame 和处理结果。即使页面重绘 (Rerun)，数据依然保留，无需重新上传。
*   **真正的明暗模式 (Real Dark/Light Mode)**:
    *   **问题**: 之前的按钮只是切换了图标，没有真正改变 CSS。
    *   **方案**: 编写两套 CSS 变量 (Light/Dark Theme Variables)。通过 Session State 动态注入对应的 CSS 块，强制覆盖 Streamlit 的默认样式，实现无缝切换。
*   **粒子动效背景 (Particle Background)**:
    *   **方案**: 引入 `particles.js` 库，通过 `st.components.v1.html` 注入一个全屏的、低侵入感的动态背景，提升科技感（"帅"）。

## 2. Chrome 插件国际化与联动 (Extension & Sync)

*   **默认英文 (Default English)**:
    *   **方案**: 修改 `popup.html` 和 `popup.js`，将默认文本改为英文。
    *   **联动机制**: 当从插件点击 "Open Main Site" 时，URL 附带参数 `?lang=en` 或 `?lang=zh`。Main Site 读取 URL 参数自动设置初始语言。

## 3. 高级可视化与降噪 (Advanced Vis & De-noising)

*   **高级图表 (Advanced Charts)**:
    *   **方案**: 放弃默认 Plotly 模板，定制一套 "Cyberpunk" 风格的配色方案（渐变色、发光效果）。
    *   **雷达图优化**: 增加填充透明度，优化网格线，使其更具现代感。
*   **中文降噪 (Chinese De-noising)**:
    *   **方案**: 引入中文停用词表（如“的”、“了”、“是”、“我”等），在分词阶段过滤这些无意义词汇，让 Top Phrases 更纯净。

## 🛠️ 执行计划 (Implementation Steps)

### Phase 1: Chrome Extension 改造
1.  **UI 英文均**: 将 `popup.html` 界面文本全面英文化。
2.  **联动逻辑**: 修改 `popup.js`，点击跳转时传递 `?lang={current_lang}` 参数。

### Phase 2: Main Site 核心逻辑重构
3.  **状态缓存**: 在 `prompt_mirror.py` 顶部增加数据缓存逻辑，检查 `st.session_state` 是否已有数据。
4.  **参数读取**: 读取 URL Query Params (`st.query_params`) 初始化语言设置。
5.  **中文停用词**: 添加 `chinese_stops` 集合，并在 `process_tokens` 中应用。

### Phase 3: Main Site 视觉重构
6.  **CSS 引擎**: 编写更复杂的 `theme_css` 生成逻辑，根据 `st.session_state.theme` 注入截然不同的 CSS 变量。
7.  **粒子特效**: 创建 `particles_component`，注入动态背景代码。
8.  **图表升级**: 统一更新 Plotly 配置 (`update_layout`, `update_traces`)，应用高级配色。

**您是否同意这个升级方案？**
