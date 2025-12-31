# Main Site 5.0 & Extension 升级方案：奢华质感与深度降噪

根据您的“奢侈品数据看板”和“深度降噪”要求，我制定了以下升级计划：

## 1. Chrome Extension 国际化联动 (Sync & i18n)
*   **双语切换**: 在插件 Popup 顶部增加 `🌐 EN/CN` 切换按钮。
*   **状态同步**: 插件内部记录语言偏好。点击 "Open Main Site" 时，自动携带 `?lang=en` 或 `?lang=zh`，实现主站与插件语言一致。
*   **默认英文**: 保持默认 English。

## 2. 核心算法升级：深度降噪 (Deep De-noising)
*   **全链路过滤**: 不仅是词云，所有涉及文本分析的图表（Top Phrases, Radar）都将经过强化过滤器。
*   **智能停用词库**:
    *   **英文**: 扩充 NLTK 库，增加 "what you", "want to", "for the" 等常见口语/介词组合的过滤逻辑。
    *   **逻辑**: 在生成 Bigram (短语) 之前，先剔除停用词，彻底杜绝 "in the" 这种无效短语上榜。

## 3. 视觉重构：Liquid Glass & Luxury Dark (UI/UX)
*   **移除明暗切换**: 只有一种模式——**极致奢华暗色 (Luxury Dark)**。
*   **背景重塑**: 深蓝黑渐变 (`#0f172a` -> `#000000`) + 动态噪点纹理 (Noise Texture) + 径向光晕。
*   **Liquid Glass 卡片**:
    *   所有图表容器化：半透明填充、细微磨砂、1px 极细高光边框。
    *   悬浮感阴影。
*   **图表美学 (Plotly Upgrade)**:
    *   **配色**: 香槟金 (`#D4AF37`) + 皇家紫 (`#6A5ACD`)。
    *   **质感**: 圆角柱体、渐变填充。
    *   **洞察线**: 自动计算 Median (中位数) 和 P90，用优雅细线标注在图表中。
    *   **Summary Chip**: 图表右上角悬浮显示关键统计数据 (N, Median)。

## 🛠️ 执行步骤

### Phase 1: Chrome Extension 改造
1.  修改 `popup.html`: 增加语言切换按钮。
2.  修改 `popup.js`: 实现界面文本的动态翻译，以及跳转 URL 的参数拼接。

### Phase 2: Main Site 逻辑与算法
3.  **移除 Theme Toggle**: 代码中删除相关逻辑，强制 Dark Mode。
4.  **强化 NLP**: 重写 `get_cleaned_tokens` 和 `generate_bigrams` 函数，加入强力停用词过滤。

### Phase 3: Main Site 视觉大修
5.  **CSS 注入**: 编写全新的 `luxury_css`，覆盖 Streamlit 默认样式，实现玻璃拟态和噪点背景。
6.  **图表重绘**: 封装一个新的 `plot_luxury_bar` 和 `plot_luxury_line` 函数，统一应用香槟金配色、中位数辅助线和 Summary Chips。

**准备好迎接您的“产品级”发布会了吗？**
