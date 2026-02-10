#!/bin/bash
# Quick Keep-Alive Setup Script for Streamlit

set -e

echo "🚀 SPR Streamlit Keep-Alive 快速设置"
echo "======================================"
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 需要 Python 3，但未找到"
    exit 1
fi

echo "✅ Python 3 已找到: $(python3 --version)"
echo ""

# 检查和安装依赖
echo "📦 检查依赖..."
if ! python3 -c "import requests" 2>/dev/null; then
    echo "📥 安装 requests..."
    pip3 install requests
fi
echo "✅ 依赖就绪"
echo ""

# 获取 Streamlit URL
read -p "📍 输入你的 Streamlit 应用 URL (例如: my-app.streamlit.app): " streamlit_url

if [ -z "$streamlit_url" ]; then
    echo "❌ URL 不能为空"
    exit 1
fi

# 确保 URL 有协议
if [[ ! "$streamlit_url" =~ ^https?:// ]]; then
    streamlit_url="https://$streamlit_url"
fi

echo ""
echo "✅ 应用 URL: $streamlit_url"
echo ""

# 选择运行方式
echo "选择运行方式:"
echo "1. 后台运行（推荐 - 本地 24/7）"
echo "2. 前台运行（用于测试）"
echo "3. 设置 GitHub Actions（推荐 - 免费自动化）"
read -p "选择 [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "🔧 设置后台运行..."
        
        # 创建日志目录
        mkdir -p ~/.spr/logs
        
        # 检查是否已在运行
        if pgrep -f "python.*keep_alive.py" > /dev/null; then
            echo "⚠️  已有 keep_alive 进程在运行，停止它..."
            pkill -f "python.*keep_alive.py" || true
            sleep 1
        fi
        
        # 创建配置文件
        cat > ~/.spr/keep_alive_config.sh << EOF
#!/bin/bash
export STREAMLIT_APP_URL="$streamlit_url"
export KEEP_ALIVE_INTERVAL=240
cd "$(pwd)"
python3 keep_alive.py >> ~/.spr/logs/keep_alive.log 2>&1
EOF
        chmod +x ~/.spr/keep_alive_config.sh
        
        # 后台运行
        nohup ~/.spr/keep_alive_config.sh > /dev/null 2>&1 &
        sleep 1
        
        if pgrep -f "python.*keep_alive.py" > /dev/null; then
            echo "✅ Keep-Alive 已在后台启动"
            echo ""
            echo "查看实时日志:"
            echo "  tail -f ~/.spr/logs/keep_alive.log"
            echo ""
            echo "停止 Keep-Alive:"
            echo "  pkill -f 'python.*keep_alive.py'"
        else
            echo "❌ 启动失败"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo "🧪 前台运行（按 Ctrl+C 停止）..."
        echo ""
        export STREAMLIT_APP_URL="$streamlit_url"
        python3 keep_alive.py
        ;;
    
    3)
        echo ""
        echo "🔗 GitHub Actions 设置"
        echo ""
        echo "1. 访问 GitHub: https://github.com/$(git config user.name 2>/dev/null || echo 'your-username')/$(basename $(git rev-parse --show-toplevel 2>/dev/null || echo 'repo'))"
        echo "2. 进入 Settings → Secrets and variables → Actions"
        echo "3. 点击 'New repository secret'，添加以下内容:"
        echo ""
        echo "   Secret Name:  STREAMLIT_APP_URL"
        echo "   Secret Value: $streamlit_url"
        echo ""
        echo "4. 返回本项目，GitHub Actions 会自动开始运行"
        echo ""
        echo "✅ 工作流文件已创建: .github/workflows/streamlit-keep-alive.yml"
        echo ""
        read -p "按 Enter 在浏览器中打开 GitHub..."
        if command -v open &> /dev/null; then
            open "https://github.com/settings/secrets/actions"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://github.com/settings/secrets/actions"
        fi
        ;;
    
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "📚 更多信息请查看: STREAMLIT_KEEP_ALIVE.md"
echo "✅ 设置完成！"
