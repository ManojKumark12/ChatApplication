from ..rate_limiting import action_rate_limit_key,MAX_TIME
from .redis_client_sync import redis_client
def get_current_rate_limit_count(key):
    return redis_client.incr(key)
def rate_limit_check(key,action):
    curr_messages=get_current_rate_limit_count(key)
    max_messages=action_rate_limit_key.get(action)
    if curr_messages==1:
        redis_client.expire(key,MAX_TIME)
    if curr_messages>max_messages:
        # print("graterrrrrrrrrrrrrr",curr_messages)
        return False
    # print("noooooooooooooooooo",curr_messages)
    return True
