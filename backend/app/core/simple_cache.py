"""
简单的内存缓存实现（替代Redis）
用于Windows环境或不需要Redis的场景
"""
from typing import Optional, Any
import time
import json


class SimpleCache:
    """简单的内存缓存类"""
    
    def __init__(self):
        self._cache: dict = {}
        self._expire: dict = {}
    
    def get(self, key: str) -> Optional[Any]:
        """获取缓存值"""
        if key in self._cache:
            if time.time() < self._expire.get(key, float('inf')):
                return self._cache[key]
            else:
                # 过期，删除
                del self._cache[key]
                if key in self._expire:
                    del self._expire[key]
        return None
    
    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """设置缓存值"""
        try:
            self._cache[key] = value
            self._expire[key] = time.time() + expire
            return True
        except Exception:
            return False
    
    def delete(self, key: str) -> bool:
        """删除缓存"""
        if key in self._cache:
            del self._cache[key]
            if key in self._expire:
                del self._expire[key]
            return True
        return False
    
    def clear(self) -> None:
        """清空所有缓存"""
        self._cache.clear()
        self._expire.clear()
    
    def exists(self, key: str) -> bool:
        """检查键是否存在"""
        return self.get(key) is not None


# 全局缓存实例
cache = SimpleCache()


# 模拟Redis客户端接口（用于兼容性）
class RedisClient:
    """模拟Redis客户端"""
    
    def __init__(self):
        self._cache = SimpleCache()
    
    def get(self, key: str) -> Optional[bytes]:
        """获取值（返回bytes以兼容Redis接口）"""
        value = self._cache.get(key)
        if value is not None:
            if isinstance(value, bytes):
                return value
            return json.dumps(value).encode('utf-8')
        return None
    
    def set(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        """设置值"""
        if isinstance(value, bytes):
            try:
                value = json.loads(value.decode('utf-8'))
            except Exception:
                value = value.decode('utf-8')
        return self._cache.set(key, value, expire=ex or 3600)
    
    def delete(self, key: str) -> int:
        """删除键，返回删除的数量"""
        return 1 if self._cache.delete(key) else 0
    
    def exists(self, key: str) -> int:
        """检查键是否存在"""
        return 1 if self._cache.exists(key) else 0
    
    def ping(self) -> bool:
        """健康检查"""
        return True


# 创建全局Redis客户端（用于替代真实的Redis）
redis_client = RedisClient()
