from .redis_client import redis_client
action_rate_limit_key={
    'chat_messages':10 #per minute
}
MAX_TIME=60 #per minute
def get_current_rate_limit_count(key):
    redis_client.incr(key)
    return int(redis_client.get(key))
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

    

