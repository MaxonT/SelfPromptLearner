"""
Streamlit Keep-Alive 模块
在 Streamlit 应用启动时集成，保证应用不会进入睡眠状态
"""

import threading
import time
import logging
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)


class StreamlitKeepAlive:
    """Streamlit 应用 Keep-Alive 管理器"""
    
    def __init__(self, interval_seconds: int = 30):
        """
        初始化 Keep-Alive
        
        Args:
            interval_seconds: 内部心跳间隔(秒)
        """
        self.interval = interval_seconds
        self.thread: Optional[threading.Thread] = None
        self.running = False
        self.last_heartbeat = None
        
    def start(self):
        """启动 Keep-Alive 后台线程"""
        if self.running:
            logger.warning('Keep-Alive 已在运行')
            return
        
        self.running = True
        self.thread = threading.Thread(daemon=True, target=self._heartbeat_loop)
        self.thread.start()
        logger.info(f'✅ Streamlit Keep-Alive 已启动 (间隔: {self.interval}秒)')
        
    def stop(self):
        """停止 Keep-Alive"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        logger.info('Keep-Alive 已停止')
        
    def _heartbeat_loop(self):
        """后台心跳循环"""
        logger.info('💚 Keep-Alive 心跳循环已启动')
        
        while self.running:
            try:
                # 记录心跳时间
                self.last_heartbeat = datetime.now()
                timestamp = self.last_heartbeat.strftime('%H:%M:%S')
                logger.debug(f'[{timestamp}] Keep-Alive 心跳 💓')
                
                # 等待直到下一个间隔
                time.sleep(self.interval)
                
            except Exception as e:
                logger.error(f'Keep-Alive 心跳异常: {e}')
                time.sleep(self.interval)
    
    def get_status(self) -> dict:
        """获取 Keep-Alive 状态"""
        return {
            'running': self.running,
            'interval': self.interval,
            'last_heartbeat': self.last_heartbeat.isoformat() if self.last_heartbeat else None,
        }


# 全局实例
_keep_alive_instance: Optional[StreamlitKeepAlive] = None


def initialize_keep_alive(interval_seconds: int = 30) -> StreamlitKeepAlive:
    """
    初始化全局 Keep-Alive 实例
    
    Args:
        interval_seconds: 心跳间隔(秒)
    
    Returns:
        StreamlitKeepAlive 实例
    """
    global _keep_alive_instance
    
    if _keep_alive_instance is None:
        _keep_alive_instance = StreamlitKeepAlive(interval_seconds)
        _keep_alive_instance.start()
    
    return _keep_alive_instance


def get_keep_alive() -> Optional[StreamlitKeepAlive]:
    """获取全局 Keep-Alive 实例"""
    return _keep_alive_instance
