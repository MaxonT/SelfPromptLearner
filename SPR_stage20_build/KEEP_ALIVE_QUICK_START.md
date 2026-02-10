# SPR Streamlit Keep-Alive 快速参考

## 🎯 问题症状

你的应用显示 "your app is sleeping"，但 ping 日志显示正在运行。

## ⚡ 快速修复（选一个）

### 方案 1: 一键启动（最简单）
```bash
chmod +x setup_keep_alive.sh
./setup_keep_alive.sh
```

### 方案 2: 直接运行脚本
```bash
pip install requests
export STREAMLIT_APP_URL="https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app"
python keep_alive.py
```

### 方案 3: 后台运行（Linux/Mac）
```bash
nohup python keep_alive.py > keep_alive.log 2>&1 &
tail -f keep_alive.log
```

### 方案 4: GitHub Actions（完全自动）
1. 访问 GitHub: https://github.com/settings/secrets/actions
2. 添加 Secret: `STREAMLIT_APP_URL` = `https://your-app.streamlit.app`
3. 完成！工作流已配置在 `.github/workflows/streamlit-keep-alive.yml`

---

## 📊 我们做了什么

| 组件 | 改进 | 频率 |
|------|------|------|
| Extension | ping 增强 | 每 15-30 秒 |
| Python 脚本 | 独立监视 | 每 4 分钟 |
| GitHub Actions | 自动化 | 每 3 分钟 |

---

## ✅ 验证

```bash
# 查看 Extension 日志（Chrome DevTools）
chrome://extensions/ → SPR → Service Worker

# 查看脚本日志
tail -f keep_alive.log

# 手动测试
curl https://your-app.streamlit.app/ -v
```

---

## 📁 新增文件

- `keep_alive.py` - 独立 Python Keep-Alive 脚本
- `streamlit_keep_alive.py` - Streamlit 应用集成模块
- `setup_keep_alive.sh` - 快速设置向导
- `STREAMLIT_KEEP_ALIVE.md` - 详细文档
- `.github/workflows/streamlit-keep-alive.yml` - GitHub Actions 工作流

---

## 🆘 故障排查

| 问题 | 解决方案 |
|------|--------|
| 仍显示睡眠 | 刷新页面；增加 KEEP_ALIVE_INTERVAL 到 180 秒 |
| 脚本报错 | 运行 `pip install requests` |
| Extension 不工作 | Chrome DevTools → Application → Clear storage |

---

## 📞 需要帮助？

查看完整文档: `STREAMLIT_KEEP_ALIVE.md`

