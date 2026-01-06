我将执行以下计划，彻底解决词云在多语言环境下的乱码问题，实现“国际化”支持：

1. **重构字体检测逻辑 (`prompt_mirror.py`)**

   * 将 `get_chinese_font` 升级为 `get_supporting_font`。

   * **扩充字体库**：

     * **通用 (Universal)**: 优先寻找 `Arial Unicode MS` (支持中日韩及西欧特殊字符)。

     * **日语 (Japanese)**: 添加 Mac 的 `Hiragino Sans` 和 Windows 的 `Meiryo`, `Yu Gothic`。

     * **韩语 (Korean)**: 添加 Mac 的 `AppleGothic` 和 Windows 的 `Malgun Gothic`。

     * **Linux**: 添加 `Noto Sans CJK` 系列。

   * **优化优先级**：通用字体 > 系统特定语言字体 > 兜底字体。

2. **更新 UI 提示信息**

   * 将“中文字体未找到”的警告更新为“未找到支持 CJK (中日韩) 的字体”，使其更准确。

3. **验证修复**

   * 在当前 Mac 环境下运行一次检测函数，确认它能正确抓取到 `Arial Unicode` 或 `Hiragino` 等高质量字体。

4. **更新文档状态**

   * 更新 `.trae/documents/修复词云中文乱码问题.md`，记录此次从“仅中文修复”到“国际化修复”的升级。

