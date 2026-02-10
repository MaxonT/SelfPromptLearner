# Streamlit Keep-Alive 诊断和修复指南

## 🎯 目标

确保你的 Streamlit 应用保持活跃，不会因为不活动而进入睡眠状态。

---

## ✅ 已完成的修复

### 1. ✅ Streamlit 应用集成 Keep-Alive
已在 `mirror/prompt_mirror.py` 中添加内部 Keep-Alive，每 30 秒发送心跳。

### 2. ✅ GitHub Actions 配置存在
`.github/workflows/streamlit-keep-alive.yml` 已配置，设置为每 3 分钟 ping 一次。

---

## 🔍 现在需要你检查的事项

### 检查 1: 确认你的 Streamlit 应用 URL

你的 Streamlit 应用 URL 是什么？例如：
- `https://你的应用名.streamlit.app`
- `https://share.streamlit.io/你的用户名/仓库名/main/mirror/prompt_mirror.py`

**记下这个 URL**，下一步需要用到。

---

### 检查 2: 在 GitHub 中设置 Secret

#### 步骤 A: 打开 GitHub Secrets 设置
1. 打开你的 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单找到 **Secrets and variables** → 点击 **Actions**
4. 查看是否有 `STREAMLIT_APP_URL` 这个 secret

#### 步骤 B: 添加或更新 Secret
如果 `STREAMLIT_APP_URL` 不存在或不正确：

1. 点击 **New repository secret**（或点击现有 secret 的 **Update** 按钮）
2. 填写：
   - **Name**: `STREAMLIT_APP_URL`
   - **Secret**: `https://你的应用名.streamlit.app`（你在检查 1 中记下的 URL）
3. 点击 **Add secret** 或 **Update secret**

---

### 检查 3: 验证 GitHub Actions 是否运行

#### 步骤 A: 查看 Actions 运行记录
1. 在 GitHub 仓库中，点击 **Actions** 标签
2. 在左侧找到 **Streamlit Keep-Alive** workflow
3. 查看最近的运行记录

#### 步骤 B: 检查运行状态

**情况 1: 没有任何运行记录**
- ❌ 问题：Workflow 从未运行过
- ✅ 解决：手动触发一次
  1. 点击左侧的 **Streamlit Keep-Alive**
  2. 点击右上角的 **Run workflow** 下拉按钮
  3. 点击绿色的 **Run workflow** 按钮
  4. 等待几秒钟，刷新页面
  5. 应该能看到一个正在运行的 workflow

**情况 2: 有运行记录，但都是红色 ❌（失败）**
- ❌ 问题：Workflow 运行失败
- ✅ 解决：
  1. 点击最近的一次运行记录
  2. 点击 **keep-alive** job
  3. 查看 **Run Keep-Alive ping** 步骤的日志
  4. 常见错误：
     - `❌ STREAMLIT_APP_URL not set` → 返回检查 2，确保 secret 已设置
     - `Request failed` → 检查你的 Streamlit 应用是否正常运行

**情况 3: 有绿色 ✅ 的成功记录**
- ✅ 太好了！GitHub Actions 正在工作
- 查看日志应该能看到：
  ```
  ⏱️  [10:00:00] Pinging https://你的应用.streamlit.app...
  ✅ Ping successful! Status: 200
  ```

#### 步骤 C: 检查运行频率
- GitHub Actions 应该**每 3 分钟**自动运行一次
- 查看运行记录时间戳，确认频率是否正确
- 如果超过 3 分钟没有新的运行记录：
  1. 检查 workflow 文件是否被禁用
  2. 尝试手动触发一次（步骤 B 中的情况 1）

---

### 检查 4: 验证应用内 Keep-Alive

#### 在部署后检查日志

如果你能访问 Streamlit Cloud 的日志：

1. 登录 [Streamlit Cloud Dashboard](https://share.streamlit.io/)
2. 找到你的应用
3. 点击 **Manage app** → **Logs**
4. 应该能看到类似的日志：
   ```
   ✅ Streamlit Keep-Alive 已启动 (间隔: 30秒)
   💚 Keep-Alive 心跳循环已启动
   ```

如果看不到这些日志，可能是导入失败（不影响应用功能，但内部 keep-alive 不会工作）。

---

## 🧪 测试 Keep-Alive 是否生效

### 测试步骤：

1. **现在**记录当前时间
2. **关闭**所有浏览器中的 Streamlit 应用标签页
3. **等待 20 分钟**（不要访问应用）
4. **20 分钟后**再次打开应用
5. 观察加载速度：
   - ✅ **立即加载**（1-2 秒内） → Keep-Alive 工作正常！
   - ❌ **慢速加载**（10-30 秒，显示 "Your app is waking up"） → Keep-Alive 未生效

---

## 🔧 如果还是睡着了...

如果完成所有检查后应用还是睡眠，请检查：

### 问题 A: GitHub Actions 配额用完
- GitHub 免费账户每月有 2000 分钟 Actions 配额
- 查看配额：GitHub 仓库 → Settings → Billing → Plans and usage
- 如果配额用完，需要等到下月或升级账户

### 问题 B: Streamlit 应用部署在社区版（免费）
- Streamlit Community Cloud 免费应用可能有严格的资源限制
- 即使有 keep-alive，可能还是会在长时间不活动后睡眠
- 考虑升级到付费计划

### 问题 C: 防火墙或网络问题
- GitHub Actions 的请求可能被阻止
- 尝试从不同的网络手动 ping 你的应用
- 使用 UptimeRobot 等第三方服务作为备份

---

## 📊 监控运行状态

### 推荐：设置 GitHub Actions 通知

1. GitHub 仓库 → Settings → Notifications
2. 勾选 **Send notifications for workflow runs**
3. 如果 keep-alive 失败，你会收到邮件通知

### 查看统计数据

GitHub Actions → Streamlit Keep-Alive → 点击任意运行记录 → 可以看到：
- 运行时长
- 成功/失败状态
- 详细日志

---

## ✅ 完成检查清单

完成以下所有项目：

- [ ] 确认 Streamlit 应用 URL
- [ ] 在 GitHub 添加 `STREAMLIT_APP_URL` secret
- [ ] GitHub Actions 中能看到 **Streamlit Keep-Alive** workflow
- [ ] 手动运行一次 workflow，确认成功（绿色 ✅）
- [ ] 查看 workflow 日志，看到 `✅ Ping successful`
- [ ] 推送新代码到 GitHub（包含 prompt_mirror.py 的修改）
- [ ] 等待 Streamlit 应用自动重新部署
- [ ] 进行 20 分钟测试，验证应用不会睡眠

---

## 🎉 成功指标

完成设置后，你应该看到：

1. ✅ GitHub Actions 每 3 分钟自动运行一次，全部成功
2. ✅ Streamlit 应用日志中显示 Keep-Alive 已启动
3. ✅ 20 分钟不访问后，应用仍然立即响应

---

## ❓ 需要帮助？

如果完成所有步骤后仍有问题，请提供：

1. 你的 Streamlit 应用 URL
2. GitHub Actions 最近一次运行的日志（截图或复制文本）
3. 是否能在 Streamlit Cloud 日志中看到 Keep-Alive 启动消息
4. 20 分钟测试的结果

这样我可以帮你进一步诊断问题！
