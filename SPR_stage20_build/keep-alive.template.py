#!/usr/bin/env python3
"""
Universal Keep-Alive Service Template
通用的保活脚本模板 - 支持任何需要定期 ping 的服务

使用方法：
1. 复制这个文件到新目录
2. 修改下面的 CONFIG 部分
3. 参考 keep-alive.template.launchd 配置 launchd
4. 运行即可

配置说明：
- SERVICE_NAME: 服务名称（显示在通知和日志中）
- SERVICE_URL: 需要 ping 的服务地址
- PING_INTERVAL: ping 间隔（秒），建议 300（5分钟）
- FAILURE_THRESHOLD: 连续失败多少次才发送通知，建议 3
- LOG_FILE: 日志文件路径，默认 ~/.{service_name}-keepalive.out.log
- ENABLE_NOTIFICATIONS: 是否启用 macOS 通知
"""

import requests
import time
import sys
import subprocess
import os
from datetime import datetime


# ============ 配置区域 ============
CONFIG = {
    "SERVICE_NAME": "MyService",  # 修改这里：你的服务名称
    "SERVICE_URL": "https://example.com/",  # 修改这里：你的服务 URL
    "PING_INTERVAL": 300,  # ping 间隔（秒），300 = 5分钟
    "FAILURE_THRESHOLD": 3,  # 连续失败几次发送通知
    "ENABLE_NOTIFICATIONS": True,  # 是否启用 macOS 通知
    "TIMEOUT": 10,  # 请求超时时间（秒）
}
# ============ 配置区域结束 ============


def get_log_file():
    """生成日志文件路径"""
    service_name = CONFIG["SERVICE_NAME"].lower().replace(" ", "-")
    return os.path.expanduser(f"~/.{service_name}-keepalive.out.log")


def log_message(message):
    """写入日志文件"""
    log_file = get_log_file()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] {message}\n")
        f.flush()


def send_notification(title, message):
    """发送 macOS 通知"""
    if not CONFIG["ENABLE_NOTIFICATIONS"]:
        return

    try:
        script = f'display notification "{message}" with title "{title}"'
        subprocess.run(['osascript', '-e', script], capture_output=True)
        log_message(f"📲 Notification sent: {title} - {message}")
    except Exception as e:
        log_message(f"⚠️ Failed to send notification: {e}")


def keep_alive():
    """主保活循环"""
    service_name = CONFIG["SERVICE_NAME"]
    service_url = CONFIG["SERVICE_URL"]
    ping_interval = CONFIG["PING_INTERVAL"]
    failure_threshold = CONFIG["FAILURE_THRESHOLD"]
    timeout = CONFIG["TIMEOUT"]

    log_message(f"🚀 Starting keep-alive service: {service_name}")
    log_message(f"📍 Target URL: {service_url}")
    log_message(f"⏱️  Ping interval: {ping_interval} seconds")
    log_message(f"⚠️  Failure threshold: {failure_threshold}")
    log_message(f"---")

    consecutive_failures = 0
    ping_count = 0
    success_count = 0

    while True:
        try:
            start_time = time.time()
            response = requests.get(service_url, timeout=timeout)
            end_time = time.time()
            response_time = round((end_time - start_time) * 1000, 2)

            ping_count += 1

            if response.status_code == 200:
                consecutive_failures = 0
                success_count += 1
                log_message(f"✅ Ping #{ping_count} OK - Status: {response.status_code} ({response_time}ms)")
            else:
                consecutive_failures += 1
                log_message(f"⚠️ Ping #{ping_count} Warning - Status: {response.status_code} ({response_time}ms)")

            # 连续失败达到阈值时发送通知
            if consecutive_failures >= failure_threshold:
                send_notification(
                    f"{service_name} Keep-Alive Alert",
                    f"连续 {consecutive_failures} 次 ping 失败！\n{service_url}"
                )
                consecutive_failures = 0

        except requests.exceptions.Timeout:
            consecutive_failures += 1
            ping_count += 1
            log_message(f"⏱️ Ping #{ping_count} Timeout - Server might be waking up")
            if consecutive_failures >= failure_threshold:
                send_notification(
                    f"{service_name} Keep-Alive Alert",
                    f"网络超时（{timeout}s）！应用可能需要更长时间启动。"
                )
                consecutive_failures = 0

        except requests.exceptions.ConnectionError:
            consecutive_failures += 1
            ping_count += 1
            log_message(f"🔌 Ping #{ping_count} Connection Error")
            if consecutive_failures >= failure_threshold:
                send_notification(
                    f"{service_name} Keep-Alive Alert",
                    f"网络连接错误！请检查网络连接。"
                )
                consecutive_failures = 0

        except Exception as e:
            consecutive_failures += 1
            ping_count += 1
            log_message(f"❌ Ping #{ping_count} Error: {type(e).__name__}: {e}")
            if consecutive_failures >= failure_threshold:
                send_notification(
                    f"{service_name} Keep-Alive Alert",
                    f"未知错误: {type(e).__name__}"
                )
                consecutive_failures = 0

        # 每隔 ping_interval 秒运行一次
        time.sleep(ping_interval)


if __name__ == "__main__":
    try:
        keep_alive()
    except KeyboardInterrupt:
        log_message("⛔ Keep-alive service stopped manually.")
        send_notification(f"{CONFIG['SERVICE_NAME']} Keep-Alive", "服务已手动停止")
        sys.exit(0)
