# 修复大文件解析中的 KeyError 问题

## 异常分析
用户遇到的 `Stream parsing failed... ('parts')` 和 `Data parsing failed: 'parts'` 错误，是因为在解析 ChatGPT 官方导出数据 (`conversations.json`) 时，代码假设所有 `user` 角色的消息体 (`message.content`) 都包含 `parts` 字段。
实际上，某些特殊消息（如插件调用、文件上传、或被标记为 flagged 的内容）可能不包含 `parts` 字段，或者 `content` 结构不同，直接使用 `['parts']` 访问会导致 `KeyError` 从而中断整个解析过程。

## 修复方案
我将修改 `mirror/prompt_mirror.py` 中的解析逻辑，将硬编码的字典访问改为安全的 `.get()` 方法，并增加类型检查，确保即使遇到异常结构的消息也能跳过并继续解析，而不是直接崩溃。

### 具体实施步骤
1.  **修改流式解析逻辑 (ijson)**：
    -   定位到 `mirror/prompt_mirror.py` 第 709 行附近。
    -   将 `parts = v['message']['content']['parts']` 替换为安全访问逻辑：
        ```python
        content = v['message'].get('content')
        parts = content.get('parts') if isinstance(content, dict) else None
        ```
2.  **修改回退解析逻辑 (Legacy Load)**：
    -   定位到 `mirror/prompt_mirror.py` 第 757 行附近。
    -   应用相同的安全访问修复，确保在流式解析失败回退到普通加载时也能正常工作。
3.  **验证**：
    -   重启 Streamlit 服务。
    -   提示用户重新上传文件验证修复效果。

该方案遵循**最小改动原则**，仅增强解析的健壮性，不改变原有业务逻辑。