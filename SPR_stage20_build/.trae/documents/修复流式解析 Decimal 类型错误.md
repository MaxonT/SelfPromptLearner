# 修复流式解析中的 Decimal 错误

## 异常分析
用户遇到的 `Stream parsing failed... ('decimal.Decimal' object cannot be interpreted as an integer)` 错误是因为 `ijson` 库在解析 JSON 中的数字时，默认会将其转换为 `decimal.Decimal` 类型以保持精度。
然而，在代码第 716 行 `datetime.fromtimestamp(ct)` 中，`fromtimestamp` 函数要求参数必须是 `float` 或 `int` 类型，不支持 `Decimal` 类型。因此，当 `ct`（create_time）是一个 `Decimal` 对象时，就会抛出该类型错误，导致流式解析失败并回退到 legacy load。

## 修复方案
在调用 `datetime.fromtimestamp()` 之前，显式将 `ct`（时间戳）转换为 `float` 类型。这既能兼容 `ijson` 返回的 `Decimal` 类型，也能兼容普通 JSON 解析返回的 `int` 或 `float` 类型。

### 具体实施步骤
1.  **修改 `mirror/prompt_mirror.py`**：
    -   定位到流式解析逻辑（第 716 行附近）。
    -   将 `new_timestamps.append(datetime.fromtimestamp(ct))` 修改为 `new_timestamps.append(datetime.fromtimestamp(float(ct)))`。
    -   同样检查 Legacy Load 部分（虽然 `json.load` 通常返回 `int`/`float`，但为了统一健壮性，建议也加上 `float()` 转换）。

2.  **验证**：
    -   重启 Streamlit 服务。
    -   重新导入文件，确认不再出现黄色警告条，且时间戳解析正常。