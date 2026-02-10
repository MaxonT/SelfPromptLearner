#!/bin/bash
# 快速检查 Streamlit Keep-Alive 配置是否正确

echo "=================================================="
echo "🔍 Streamlit Keep-Alive 配置检查工具"
echo "=================================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
PASS=0
FAIL=0

# 检查 1: streamlit_keep_alive.py 文件存在
echo "📝 检查 1: streamlit_keep_alive.py 文件"
if [ -f "streamlit_keep_alive.py" ]; then
    echo -e "${GREEN}✅ 文件存在${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ 文件不存在${NC}"
    FAIL=$((FAIL+1))
fi
echo ""

# 检查 2: GitHub Actions workflow 文件存在
echo "📝 检查 2: GitHub Actions workflow 配置"
if [ -f ".github/workflows/streamlit-keep-alive.yml" ]; then
    echo -e "${GREEN}✅ Workflow 文件存在${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ Workflow 文件不存在${NC}"
    FAIL=$((FAIL+1))
fi
echo ""

# 检查 3: prompt_mirror.py 是否导入了 keep-alive
echo "📝 检查 3: Streamlit 应用集成 Keep-Alive"
if grep -q "streamlit_keep_alive" mirror/prompt_mirror.py; then
    echo -e "${GREEN}✅ prompt_mirror.py 已导入 Keep-Alive${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ prompt_mirror.py 未导入 Keep-Alive${NC}"
    FAIL=$((FAIL+1))
fi
echo ""

# 检查 4: Python 依赖
echo "📝 检查 4: Python 依赖 (requests)"
if python3 -c "import requests" 2>/dev/null; then
    echo -e "${GREEN}✅ requests 库已安装${NC}"
    PASS=$((PASS+1))
else
    echo -e "${YELLOW}⚠️  requests 库未安装 (GitHub Actions 会自动安装)${NC}"
fi
echo ""

# 检查 5: Git 仓库状态
echo "📝 检查 5: Git 状态"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
    
    # 检查是否有未提交的更改
    if git diff --quiet && git diff --staged --quiet; then
        echo -e "${GREEN}✅ 没有未提交的更改${NC}"
    else
        echo -e "${YELLOW}⚠️  有未提交的更改，记得提交并推送!${NC}"
    fi
    
    # 检查远程仓库
    if git remote -v | grep -q "github.com"; then
        echo -e "${GREEN}✅ GitHub 远程仓库已配置${NC}"
        PASS=$((PASS+1))
    else
        echo -e "${RED}❌ 未找到 GitHub 远程仓库${NC}"
        FAIL=$((FAIL+1))
    fi
else
    echo -e "${RED}❌ 不是 Git 仓库${NC}"
    FAIL=$((FAIL+1))
fi
echo ""

# 提示用户测试
echo "=================================================="
echo "📊 检查结果汇总"
echo "=================================================="
echo -e "✅ 通过: ${GREEN}${PASS}${NC}"
echo -e "❌ 失败: ${RED}${FAIL}${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 所有本地检查都通过了!${NC}"
    echo ""
    echo "下一步:"
    echo "1. 确保代码已推送到 GitHub"
    echo "2. 在 GitHub 仓库 Settings → Secrets 中设置 STREAMLIT_APP_URL"
    echo "3. 在 GitHub Actions 中手动运行一次 workflow 测试"
    echo "4. 查看详细操作指南: STREAMLIT_KEEP_ALIVE_DIAGNOSIS.md"
else
    echo -e "${RED}⚠️  发现问题，请修复后再继续${NC}"
    echo ""
    echo "💡 查看修复指南: STREAMLIT_KEEP_ALIVE_DIAGNOSIS.md"
fi

echo ""
echo "=================================================="
echo "🧪 可选：本地测试 Keep-Alive 脚本"
echo "=================================================="
echo ""
echo "如果你想在本地测试 ping 功能，运行:"
echo ""
echo "  export STREAMLIT_APP_URL='https://你的应用名.streamlit.app'"
echo "  python3 keep_alive.py"
echo ""
echo "注意: keep_alive.py 是独立脚本，可在本地或服务器上运行"
echo ""
