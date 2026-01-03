# 1. 修复 Light Mode 下图表可见性问题
**原因**: 目前 Chart.js 的配置中，网格线 (grid) 和标签 (labels) 的颜色逻辑在 Light Mode 下使用了错误的透明度或颜色，导致在浅色背景下几乎不可见（例如白色网格线在白色背景上）。
**方案**:
*   在 `popup.js` 的 `renderChart` 函数中，重构颜色逻辑。
*   **Light Mode**: 使用深色网格 (`rgba(0,0,0,0.1)`) 和深色文字 (`#1e293b`)。
*   **Dark Mode**: 维持浅色网格 (`rgba(255,255,255,0.1)`) 和浅色文字 (`#cbd5e1`)。
*   确保 `pointBackgroundColor` 和 `angleLines` 也随主题动态切换。

# 2. 修复 Light Mode 下 Tab 栏颜色异常
**原因**: Tab 栏的背景色在 CSS 中被硬编码为半透明黑 (`rgba(0,0,0,0.2)`)，这在 Light Mode 下显得很脏。且激活状态的 Tab 文字颜色可能对比度不足。
**方案**:
*   在 `style.css` 中为 `.tabs` 和 `.tab-btn` 添加 Light Mode 专用样式。
*   **Light Mode**: Tab 栏背景改为浅灰 (`rgba(0,0,0,0.05)`)，激活态使用纯白背景 + 金色文字 + 深色阴影，提升精致感。

# 3. 增强 Light Mode 整体质感
**原因**: 简单的颜色反转导致 Light Mode 缺乏 Dark Mode 的高级感（Luxury Feel）。
**方案**:
*   微调 Light Mode 下的阴影 (`box-shadow`)，使其更柔和。
*   调整 KPI 卡片在 Light Mode 下的边框透明度，避免生硬的黑边。
