我将执行以下计划，在 WordCloud 上方添加一个“客观性过滤 (Objectivity Filter)”选项，以去除无意义的填充词和技术噪声，专注于概念探索：

1.  **定义过滤词库**：
    *   在 `prompt_mirror.py` 中定义 `OBJECTIVITY_STOPWORDS` 集合，包含：
        *   **技术噪声**：json, api, html, return, self, const, string, true, false, null 等。
        *   **通用动词/副词**：know, see, want, just, now, time, first, one, make, use 等。
        *   **代词/自我指涉**：I, my, we, our, you, your, self, 自己, 我们, 他们, 觉得, 认为等。
        *   **常见连词/虚词**：因为, 所以, 但是, 如果, 虽然, 或者, 还是, 以及, 除了等。

2.  **添加 UI 控制**：
    *   在 WordCloud 区域上方添加一个复选框：`st.checkbox("🛡️ 开启客观性过滤 (Objectivity Mode)", value=False, help="过滤常用词、代词和技术噪声，专注于核心概念")`。

3.  **实现过滤逻辑**：
    *   在生成 WordCloud 之前，根据复选框的状态，决定是否从 `words` 列表中移除 `OBJECTIVITY_STOPWORDS` 中的词汇。

4.  **优化 WordCloud 生成**：
    *   使用过滤后的词列表生成词云，确保展示结果更具概念性和洞察力。

此方案将直接响应您的需求，提供一个开关来“清洗”词云，使其更客观、更具分析价值。