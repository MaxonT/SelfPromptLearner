# Streamlit Keep-Alive 强化方案

## 问题分析

你的应用部署在 Streamlit 上，但仍然显示 "your app is sleeping"。虽然 ping 日志显示正在运行，但问题可能是：

1. **Ping 频率不足** - 原来 Extension 每 1 分钟 ping 一次，但 Streamlit 可能需要更频繁的活动
2. **Ping 端点问题** - `/api/extension/status` 可能不被 Streamlit 云平台识别为"真实活动"
3. **缺少应用级别的 Keep-Alive** - Extension 只在浏览器打开时运行，用户不使用时无法保持活动

## 解决方案

我们实现了 **三层 Keep-Alive 机制**：

### 1. 强化 Extension Keep-Alive（每 15-30 秒）

📍 **文件**: `frontend/extension/background.js`

- **主同步周期**: 改为 **30 秒**（原来 60 秒）
- **额外心跳**: 新增 **15 秒心跳**

```javascript
// 现在的间隔
chrome.alarms.create('sprSync', { periodInMinutes: 0.5 });      // 30秒
chrome.alarms.create('sprKeepAlive', { periodInMinutes: 0.25 }); // 15秒
```

**效果**: Extension 会像打鼓一样持续 ping，保证用户客户端始终在线

---

### 2. 独立 Python Keep-Alive 脚本（每 4 分钟）

📍 **文件**: `keep_alive.py`

这个脚本可以运行在:
- 本地机器（24/7 运行）
- 云平台的另一个服务（付费或免费）
- GitHub Actions（定时任务）

**特点**:
- 直接 HTTP GET 请求应用首页（最直接的方式）
- 自动重试多个端点
- 完整的日志记录
- 后台 API 状态心跳

**配置**:
```bash
export STREAMLIT_APP_URL="https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app"
export API_URL="https://your-backend.com"  # 可选
export API_TOKEN="your-token"             # 可选
export KEEP_ALIVE_INTERVAL=240            # 秒 (默认 4 分钟)

python keep_alive.py
```

---

### 3. Streamlit 应用内集成 Keep-Alive（备用方案）

📍 **文件**: `streamlit_keep_alive.py`

在 Streamlit 应用 (`mirror/prompt_mirror.py`) 顶部添加：

```python
from streamlit_keep_alive import initialize_keep_alive

# 在应用启动时初始化
initialize_keep_alive(interval_seconds=30)

# 应用其他代码...
```

**效果**: 应用内部维护一个后台心跳，即使没有用户交互也会保持活动

---

## 部署步骤

### 方案 A: 本地持续运行（最简单）

```bash
# 1. 安装依赖
pip install requests

# 2. 在后台运行脚本
python keep_alive.py &

# 或使用 nohup 忽略终端关闭
nohup python keep_alive.py > keep_alive.log 2>&1 &

# 查看日志
tail -f keep_alive.log
```

---

### 方案 B: GitHub Actions（完全免费）

创建 `.github/workflows/keep-alive.yml`:

```yaml
name: Keep-Alive

on:
  schedule:
    # 每 3 分钟运行一次
    - cron: '*/3 * * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install requests
      
      - name: Run single ping
        env:
          STREAMLIT_APP_URL: ${{ secrets.STREAMLIT_APP_URL }}
          API_URL: ${{ secrets.API_URL }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
        run: |
          python -c "
          import requests
          import os
          
          url = os.getenv('STREAMLIT_APP_URL')
          if url:
              try:
                  r = requests.get(url, timeout=15)
                  print(f'✅ Ping successful: {r.status_code}')
              except Exception as e:
                  print(f'❌ Ping failed: {e}')
          "
```

**配置**:
1. 在 GitHub Repo 的 Settings → Secrets 中添加:
   - `STREAMLIT_APP_URL`: 你的 Streamlit 应用 URL
   - `API_URL`: 可选
   - `API_TOKEN`: 可选

2. 推送代码，GitHub Actions 会自动每 3 分钟 ping 一次

---

### 方案 C: Streamlit 应用集成（无需外部脚本）

编辑 `mirror/prompt_mirror.py`:

```python
import streamlit as st
from streamlit_keep_alive import initialize_keep_alive

# ⭐ 在最前面添加这行
initialize_keep_alive(interval_seconds=30)

# 现有代码继续...
if 'lang' not in st.session_state:
    st.session_state.lang = 'en'
# ...
```

---

## 诊断和测试

### 查看 Extension 日志

1. 打开 Chrome 扩展管理页面: `chrome://extensions/`
2. 找到 SPR 扩展，点击 "Service Worker" 
3. 查看控制台输出

应该看到每 15-30 秒的日志：
```
✅ 后端状态心跳成功
```

### 测试 Python 脚本

```bash
# 运行一次测试
export STREAMLIT_APP_URL="https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app"
python keep_alive.py

# 查看是否输出
# ✅ Ping 成功 (/) - 状态码: 200
```

### 检查应用状态

访问 https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/ 应该看到应用已启动，不再显示睡眠界面

---

## 推荐配置

| 场景 | 推荐方案 | 配置 |
|------|---------|------|
| 个人用户 + 浏览器总是打开 | Extension 强化版 | ✅ 已自动启用 |
| 需要 24/7 在线 | Python 脚本 + GitHub Actions | 每 3 分钟 ping |
| 高可用性要求 | 所有三层 + 多个来源 | 应用内 + 脚本 + Actions |

---

## 故障排查

### 仍然显示睡眠

1. **检查 Extension 是否运行**
   ```bash
   # Chrome DevTools → Application → Service Workers
   # 应该看到 SPR Service Worker 在 running 状态
   ```

2. **检查日志**
   ```bash
   tail -f keep_alive.log
   # 应该看到 "✅ Ping 成功"
   ```

3. **检查 Streamlit 健康端点**
   ```bash
   curl https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app/ -v
   # 应该返回 200，有 HTML 内容
   ```

4. **增加 ping 频率**
   ```bash
   # 改为 2 分钟间隔
   export KEEP_ALIVE_INTERVAL=120
   python keep_alive.py
   ```

### Ping 成功但仍显示睡眠

这可能是 Streamlit 的缓存显示问题：
- 刷新页面 (F5 或 Cmd+R)
- 清除浏览器缓存
- 检查 Streamlit 云端日志

---

## 性能影响

- **Extension**: 网络流量 +5-10 KB/分钟（可忽略）
- **Python 脚本**: CPU 使用率 < 1%，内存 < 50 MB
- **应用内集成**: 额外线程开销 < 0.1%

所有方案都非常轻量级。

---

## 后续优化

如果问题仍未解决，考虑：

1. **迁移到 Render** (render.yaml 已配置，支持免费 tier 的后台任务)
2. **使用 Vercel** (需要 Node.js 后端支持)
3. **升级 Streamlit 付费方案** (获得优先级队列)

