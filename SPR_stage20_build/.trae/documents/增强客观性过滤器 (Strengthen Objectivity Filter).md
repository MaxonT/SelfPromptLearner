我将通过扩展 `OBJECTIVITY_STOPWORDS` 列表来进一步增强过滤质量，重点移除“礼貌用语”、“元指令（Prompt Engineering 框架词）”以及“模糊量词”。

**计划修改文件：**
`mirror/prompt_mirror.py`

**具体增强内容 (新增约 50+ 停用词)：**

1.  **礼貌与客套 (Politeness & Conversational):**
    *   **EN:** `kindly`, `appreciate`, `grateful`, `regards`, `hello`, `hey`, `dear`, `sorry`, `excuse`
    *   **ZH:** `你好`, `您好`, `谢谢`, `麻烦`, `请问`, `感激`, `抱歉`, `不好意思`, `辛苦`

2.  **元指令与结构词 (Meta-Instructions):**
    *   **EN:** `ignore`, `previous`, `instruction`, `constraint`, `guideline`, `rule`, `limit`, `example`, `sample`, `template`, `demo`
    *   **ZH:** `忽略`, `指令`, `限制`, `规则`, `准则`, `例子`, `示例`, `模板`, `演示`, `参考`, `标准`

3.  **模糊量词与虚词 (Vague Quantifiers):**
    *   **EN:** `some`, `any`, `all`, `every`, `few`, `many`, `part`, `whole`, `first`, `second`, `next`, `last`
    *   **ZH:** `一些`, `所有`, `任何`, `部分`, `全部`, `首先`, `其次`, `然后`, `最后`, `接着`, `一下`, `一点`

4.  **通用弱语义动词 (Weak Verbs):**
    *   **EN:** `include`, `exclude`, `add`, `remove`, `change`, `update`, `modify`
    *   **ZH:** `包含`, `包括`, `添加`, `删除`, `修改`, `更新`, `改变`

这将使“客观性过滤”模式更加纯净，专注于实际的业务领域词汇（如 `Python`, `Marketing`, `Strategy` 等）。