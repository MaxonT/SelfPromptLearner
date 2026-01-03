# 大文件上传与 JSON 解析优化计划

用户确认拥有 `conversations.json`（官方导出格式），但文件体积较大（300MB+）。用户明确表示**不需要 HTML 支持**，只需专注 JSON。

## 1. 核心目标
*   **解除上传限制**：通过配置文件将 Streamlit 的上传上限提升至 **1GB**，确保 300MB+ 的文件能顺利上传。
*   **优化 JSON 解析**：针对大文件 JSON，使用流式解析（Streaming Parsing）以避免内存溢出（OOM）。

## 2. 技术方案

### A. 提升上传上限 (`.streamlit/config.toml`)
Streamlit 默认限制为 200MB。我们需要创建一个配置文件来覆盖此设置。
*   **文件**：`.streamlit/config.toml` (位于项目根目录或 mirror 目录下)。
*   **配置**：`server.maxUploadSize = 1024` (1GB)。

### B. 大文件流式解析 (`mirror/prompt_mirror.py`)
一次性 `json.loads()` 读取 300MB+ 的 JSON 文件会消耗数倍的内存（可能达到 2-3GB RAM），极易导致崩溃。
*   **方案**：使用 `ijson` 库。
    *   `ijson` 允许迭代式解析 JSON，无需将整个文件加载到内存中。
    *   我们将逐条读取 conversation 记录，提取 prompt，保持内存占用极低。
*   **依赖**：添加 `ijson` 到 `requirements.txt`。

### C. 增强数据提取逻辑
*   适配官方 `conversations.json` 结构：
    *   遍历 `mapping` -> 查找 `message` -> 检查 `author.role == 'user'` -> 提取 `content.parts[0]`。
    *   同时提取 `create_time` 作为时间戳。

## 3. 执行步骤
1.  **更新依赖**：在 `requirements.txt` 中添加 `ijson`。
2.  **配置环境**：创建 `.streamlit/config.toml` 设置 `maxUploadSize`。
3.  **重构解析代码**：修改 `mirror/prompt_mirror.py`，引入 `ijson` 并重写 JSON 解析逻辑，替换原有的 `json.loads()`。

这不仅能解决上传问题，还能显著提升应用处理大数据的性能和稳定性。