# GitHub Actions Keep-Alive 配置指南

## 你的 Streamlit 应用
🌐 **https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app**

## 3 步快速设置（2 分钟）

### Step 1: 打开 GitHub Secrets
访问: https://github.com/settings/secrets/actions

### Step 2: 创建新 Secret
- **Name**: `STREAMLIT_APP_URL`
- **Value**: `https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app`
- 点击 "Add secret"

### Step 3: 完成！
工作流已配置在 `.github/workflows/streamlit-keep-alive.yml`，会自动：
- 每 3 分钟运行一次
- Ping 你的 Streamlit 应用
- 记录结果日志

---

## 验证

1. 访问你的 GitHub Repo
2. 点击 "Actions" 标签
3. 找到 "Streamlit Keep-Alive" 工作流
4. 应该看到定期的执行记录，状态为 ✅ **Completed**

---

## 日志

每次运行的日志都显示：
```
✅ Ping successful! Status: 200
⏳ [HH:MM:SS] Pinging https://selfpromptlearner-syaacpnx6umxrnf8uj5vwn.streamlit.app...
```

---

## 就这么简单！

现在你的 Streamlit 应用每 3 分钟会被自动 ping，永远不会因为不活动而进入睡眠状态。
