from .redis_client import redis_client
action_rate_limit_key={
    'chat_messages':5, #per minute
    'login_request':5,
    'signup_request':2
}
MAX_TIME=60 #per minute

async def get_current_rate_limit_count(key):
    return await redis_client.incr(key)
async def rate_limit_check(key,action):
    curr_messages=await get_current_rate_limit_count(key)
    max_messages=action_rate_limit_key.get(action)
    if curr_messages==1:
        await redis_client.expire(key,MAX_TIME)
    if curr_messages>max_messages:
        # print("graterrrrrrrrrrrrrr",curr_messages)
        return False
    # print("noooooooooooooooooo",curr_messages)
    return True

    

