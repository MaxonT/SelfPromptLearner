# 修复 "Top Keyword: none" 及 WordCloud 噪声问题

## 问题分析
用户反馈 Top Keyword 显示为 "none"，且词云中包含大量 "none", "pointer", "content", "metadata" 等无意义词汇。
原因在于：
1.  **JSON 解析逻辑缺陷**：在解析 ChatGPT 导出数据时，代码直接对 `parts[0]` 进行了字符串转换 (`str(parts[0])`)。对于图片上传、文件引用等非文本消息，`parts[0]` 是一个字典（如 `{'content_type': 'image_asset_pointer', ...}`），强转字符串后会将 JSON 键值对（如 "content", "pointer", "size"）作为文本内容处理。
2.  **None 值处理**：如果消息内容为空或解析为 `None`，`str(None)` 会生成字符串 "None"，被分词后变为 "none"。
3.  **停用词缺失**：`none` 未被包含在停用词表中。

## 修复方案
1.  **优化解析逻辑**：在提取 `parts[0]` 时，增加类型检查，**仅当其为字符串时才提取**。忽略字典、列表或 None 类型的非文本内容，从源头消除 "pointer", "metadata" 等噪声。
2.  **更新停用词表**：将 "none" 添加到 `english_stops` 列表中，作为兜底防护。

### 具体实施步骤
1.  **修改 `mirror/prompt_mirror.py`**：
    -   在流式解析（ijson）和回退解析（Legacy Load）的两处逻辑中，将 `text = str(parts[0])` 修改为：
        ```python
        if parts and isinstance(parts[0], str):
            text = parts[0]
        else:
            continue
        ```
    -   在 `english_stops` 集合中添加 `"none"`。

2.  **验证**：
    -   重启 Streamlit 服务。
    -   重新导入数据，检查 Top Keyword 是否恢复正常，词云是否不再包含 "none" 及 JSON 噪声词。