import time
from functools import wraps

_cache = {}

def cached(ttl: int = 120):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = (func.__name__, args, tuple(kwargs.items()))
            now = time.time()

            if key in _cache:
                value, timestamp = _cache[key]
                if now - timestamp < ttl:
                    return value

            result = await func(*args, **kwargs)
            _cache[key] = (result, now)
            return result

        return wrapper
    return decorator
