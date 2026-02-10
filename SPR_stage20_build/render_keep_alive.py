#!/usr/bin/env python3
"""
Render.com Keep-Alive 脚本
防止 Render 免费版应用在 15 分钟不活动后进入睡眠状态
默认每 10 分钟 ping 一次应用
"""

import os
import sys
import time
import logging
from datetime import datetime
import requests
from typing import Optional

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


def get_app_url() -> Optional[str]:
    """从环境变量获取应用 URL"""
    app_url = os.getenv('RENDER_APP_URL', '').strip()
    if not app_url:
        logger.error('❌ RENDER_APP_URL 环境变量未设置')
        logger.info('请设置环境变量: export RENDER_APP_URL="https://你的应用名.onrender.com"')
        return None
    
    # 确保 URL 有协议
    if not app_url.startswith(('http://', 'https://')):
        app_url = f'https://{app_url}'
    
    return app_url.rstrip('/')


def ping_app(url: str, timeout: int = 30) -> bool:
    """
    Ping Render 应用
    
    Args:
        url: 应用 URL
        timeout: 请求超时时间(秒)
    
    Returns:
        True if successful, False otherwise
    """
    try:
        # 尝试多个端点，按优先级排序
        endpoints = [
            '/api/health',  # 健康检查端点（来自 render.yaml）
            '/',            # 首页
        ]
        
        headers = {
            'User-Agent': 'SPR-Render-KeepAlive/1.0',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        }
        
        for endpoint in endpoints:
            try:
                full_url = url + endpoint
                logger.debug(f'尝试 ping: {full_url}')
                
                response = requests.get(
                    full_url,
                    headers=headers,
                    timeout=timeout,
                    allow_redirects=True,
                )
                
                if response.status_code == 200:
                    logger.info(f'✅ Ping 成功 ({endpoint}) - 状态码: {response.status_code}')
                    return True
                else:
                    logger.warning(f'⚠️  端点 {endpoint} 返回状态码: {response.status_code}')
            except requests.exceptions.Timeout:
                logger.warning(f'⏱️  Ping 超时: {endpoint}')
                continue
            except requests.exceptions.RequestException as e:
                logger.warning(f'❌ Ping 失败 ({endpoint}): {e}')
                continue
        
        logger.error('❌ 所有端点都 ping 失败')
        return False
        
    except Exception as e:
        logger.error(f'❌ Ping 异常: {e}')
        return False


def main():
    """主循环"""
    logger.info('='*60)
    logger.info('🚀 Render Keep-Alive 脚本启动')
    logger.info('='*60)
    
    # 获取配置
    app_url = get_app_url()
    if not app_url:
        logger.error('无法启动，请设置 RENDER_APP_URL 环境变量')
        sys.exit(1)
    
    interval = int(os.getenv('KEEP_ALIVE_INTERVAL', '600'))  # 默认 10 分钟
    
    logger.info(f'📍 目标应用: {app_url}')
    logger.info(f'⏰ Ping 间隔: {interval} 秒 ({interval//60} 分钟)')
    logger.info(f'💡 提示: Render 免费版应用会在 15 分钟不活动后睡眠')
    logger.info('='*60)
    
    consecutive_failures = 0
    max_failures = 5
    
    try:
        while True:
            try:
                # 执行 ping
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                logger.info(f'\n[{timestamp}] 开始 ping...')
                
                success = ping_app(app_url)
                
                if success:
                    consecutive_failures = 0
                    logger.info(f'⏳ 等待 {interval} 秒后再次 ping...\n')
                else:
                    consecutive_failures += 1
                    logger.warning(f'⚠️  连续失败次数: {consecutive_failures}/{max_failures}')
                    
                    if consecutive_failures >= max_failures:
                        logger.error(f'❌ 连续失败 {max_failures} 次，停止运行')
                        logger.error('请检查:')
                        logger.error('1. Render 应用是否正常运行')
                        logger.error('2. RENDER_APP_URL 是否正确')
                        logger.error('3. /api/health 端点是否可访问')
                        sys.exit(1)
                
                # 等待下一次 ping
                time.sleep(interval)
                
            except KeyboardInterrupt:
                logger.info('\n⏹️  用户中断，正在停止...')
                break
            except Exception as e:
                logger.error(f'❌ 循环异常: {e}')
                consecutive_failures += 1
                time.sleep(interval)
                
    except Exception as e:
        logger.error(f'❌ 致命错误: {e}')
        sys.exit(1)
    finally:
        logger.info('👋 Keep-Alive 脚本已停止')


if __name__ == '__main__':
    main()
