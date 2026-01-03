# 1. 修复分类 (Others Category Issue)
**原因**: 现有关键词覆盖率不足。
**方案**: 大幅扩充 `prompt_mirror.py` (Streamlit) 和 `popup.js` (Extension) 中的关键词库。
*   **Coding**: 增加 `fix`, `debug`, `error`, `exception`, `deploy`, `git`, `docker`, `sql`, `db` 等工程词汇。
*   **Writing**: 增加 `rewrite`, `paraphrase`, `email`, `draft`, `blog`, `proofread` 等写作词汇。
*   **Learning**: 增加 `difference`, `vs`, `define`, `example`, `roadmap` 等学习词汇。

# 2. 修复 Top Phrases 空白问题
**原因**: 停用词表 (`english_stops`) 包含 "code", "write", "generate" 等高频动词，导致 meaningful bigrams 被过度过滤。
**方案**:
*   在 `prompt_mirror.py` 中，为 Bigram 分析创建一个更宽松的停用词表（仅过滤 `the`, `is`, `at` 等纯虚词），保留动词和名词。
*   增加 "Not enough data" 的显示样式，使其更明显（如果确实没有数据）。

# 3. 恢复 Extension 明暗色切换
**原因**: 上次 UI 升级时移除了切换按钮及相关 CSS/JS 逻辑。
**方案**:
*   **popup.html**: 重新添加 🌙/☀️ 切换按钮。
*   **style.css**: 添加 `[data-theme="light"]` 样式变量覆盖（白色背景、深色文字、金色保留作为强调色）。
*   **popup.js**: 补回 `toggleTheme` 和 `initTheme` 逻辑，并持久化存储用户偏好。
