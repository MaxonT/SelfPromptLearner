# Chrome 插件原生可视化重构计划

## 核心目标
将原本依赖 Streamlit 的 Python 后端可视化逻辑，完全移植到 Chrome 插件的 Popup 页面中。
**设计对标**：Web Activity Time Tracker
**技术栈**：HTML5 + CSS3 (Flex/Grid) + Chart.js (绘图) + Vanilla JS (逻辑)

## 1. 资源准备 (Assets)
- **Chart.js**: 下载 `chart.umd.js` 到 `chrome-extension/libs/`，实现本地离线绘图，不依赖 CDN。
- **Icons**: 准备 Tab 图标（Dashboard/List/Settings），直接用 SVG 内嵌，减少文件请求。

## 2. 界面设计 (UI/UX) - `popup.html` & `style.css`
- **尺寸**：固定宽度 `380px`，高度 `550px`（类似手机 APP 比例）。
- **配色**：
  - 背景：`#f8f9fa` (浅灰)
  - 卡片：`#ffffff` (纯白 + 阴影 `0 2px 8px rgba(0,0,0,0.08)`)
  - 主色：`#3a86ff` (蓝 - 科技感)
  - 辅助色：`#ff006e` (红 - 重点), `#8338ec` (紫 - 创意)
- **布局结构**：
  - **Header**: 标题 "Prompt Mirror" + 右上角 "扫描" 按钮 (icon)。
  - **KPI Cards**: 一行两列，显示 "今日收集" 和 "总计"。
  - **Charts Area**:
    - **Tab 1 (分布)**: 饼图 (Pie)，展示 Prompt 类型分布（编程/写作/学习...）。
    - **Tab 2 (能力)**: 雷达图 (Radar)，展示六边形能力维度。
  - **Recent List**: 类似 Time Tracker 的下方列表，显示最近 5 条 Prompt 的摘要 + 时间。

## 3. 核心逻辑移植 (Logic) - `popup.js`
- **关键词分类器 (JS版)**：
  - 将 Python 里的 `categories` 字典移植为 JS 对象。
  - 实现一个轻量级 `classify(text)` 函数，用 `String.includes` 或 `RegExp` 匹配关键词。
- **数据聚合**：
  - 实时读取 `chrome.storage.local`。
  - 按 `src` (scan/clipboard) 和 `ts` (时间戳) 进行聚合统计。
- **图表渲染**：
  - 初始化 Chart.js 实例。
  - 动态更新 `chart.data` 并调用 `chart.update()`。

## 4. 交互细节
- **扫描反馈**：点击扫描后，按钮变为 "Scanning..." -> "Done"，并伴随微小的震动动画。
- **空状态**：如果没有数据，显示一个可爱的 SVG 插画（Empty State），引导用户去扫描。
- **持久化**：记住用户上次停留的 Tab 页。

## 5. 文件结构变更
```text
chrome-extension/
├── manifest.json       # 权限不变
├── background.js       # 保持不变
├── content.js          # 保持不变
├── popup.html          # 重写：复杂的 DOM 结构
├── popup.js            # 重写：绘图 + 统计逻辑
├── style.css           # 新增：独立 CSS 文件，不再内联
└── libs/
    └── chart.umd.js    # 新增：离线图表库
```

## 执行步骤
1.  **环境准备**：下载 Chart.js，建立目录结构。
2.  **UI 骨架**：编写 HTML + CSS，先把静态页面画出来，确保好看（对标截图）。
3.  **逻辑填充**：编写 JS，实现数据读取、分类算法、图表渲染。
4.  **联调验证**：在真实浏览器中加载，测试扫描、数据更新、图表动画。
