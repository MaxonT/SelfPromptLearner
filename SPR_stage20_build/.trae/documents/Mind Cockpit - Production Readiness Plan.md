# Operation "Diamond Polish": Production Readiness & Intelligence Upgrade

该计划旨在将 "Mind Cockpit" 从一个开发中的原型提升为**生产级 (Production-Ready)** 产品，重点解决**数据质量 (Quality)**、**算法智能 (Intelligence)** 和 **合规性 (Compliance)** 问题，确保 Google Chrome Store 上线顺利。

## Phase 1: 核心算法与数据质量升级 (The Brain)
**目标**：大幅提升 Dashboard 的“智商”，让数据分析不再停留在表面，而是真正反映思维深度。

1.  **NLP 智能降噪 2.0 (Smart De-noising)**
    *   **现状**：仅依赖简单的停用词表，容易漏掉 "Please", "Help me", "Write a" 等无实际语义的高频词。
    *   **升级**：
        *   引入 **"Prompt Engineering Stoplist"**：专门过滤掉 Prompt 里的套话（如 "Act as", "You are a"），只保留核心意图词汇用于词云和热力图。
        *   **垃圾 Prompt 自动熔断**：自动标记并隐藏长度 < 5 字符或仅包含标点/打招呼（"Hi", "Test"）的无效数据。

2.  **雷达图分类引擎扩容 (Category Expansion)**
    *   **现状**：关键词库太小（每类仅 10-15 个），容易导致大量 Prompt 被归类为 "Uncategorized" 或漏判。
    *   **升级**：
        *   构建 **"Tech & Cognitive Dictionary"**：将关键词库扩充 5 倍。
        *   *Coding*：覆盖主流栈 (React, Vue, AWS, Docker, Git, SQL, Regex...)。
        *   *Logic/Thinking*：覆盖思维模型词 (First principles, mental model, bias, fallacy, structure...)。

3.  **复杂度评分系统重构 (Complexity Score 2.0)**
    *   **现状**：主要看长度和几个逻辑词。
    *   **升级**：增加 **"Structural Bonus"**（结构分）。
        *   检测 Markdown 结构（列表、代码块、引用）。
        *   检测 "Role Prompting"（角色扮演模式）。
        *   检测 "Chain of Thought"（思维链模式，如 "step by step"）。

## Phase 2: Chrome Extension 合规与隐私 (The Shield)
**目标**：确保通过 Google Web Store 严格的审核，建立用户信任。

1.  **隐私政策 (Privacy Policy) 构建**
    *   **动作**：在项目中创建标准化的 `PRIVACY.md` 和 `PRIVACY.html`。
    *   **核心声明**：明确声明 "Zero Data Collection"（零数据收集），所有数据仅存储在本地 Chrome Storage (`chrome.storage.local`)，不上传任何服务器。这是过审的关键。

2.  **Extension UI 合规化**
    *   **动作**：在 Extension Popup 底部增加 "Privacy Policy" 链接（指向 GitHub Pages 或本地文件）。
    *   **动作**：增加 "Clear Data"（一键清除数据）的显性按钮，满足 GDPR "被遗忘权" 要求。

3.  **Manifest V3 最小权限审计**
    *   **动作**：再次检查 `manifest.json`，确保没有申请多余权限（如 `tabs` 权限仅在必要时使用，尽量减少 `host_permissions`）。

## Phase 3: 最终验收与打包 (The Launch)
1.  **Store Assets 准备**：准备一套符合 "Luxury" 风格的 Store 图标和截图（你可以后续用于上传）。
2.  **全链路冒烟测试**：模拟新用户从“安装插件” -> “产生数据” -> “导出” -> “导入 Main Site” 的完整流程，确保 Onboarding 指引无死角。

---
**执行顺序建议：**
先完成 **Phase 1 (算法/质量)**，因为这是用户感知的核心；再执行 **Phase 2 (合规)** 为上线做准备。
