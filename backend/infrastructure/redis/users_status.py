from .redis_client import redis_client
def set_online(user_id):

    redis_client.sadd(

        "online_users",

        user_id
    )
def set_offline(user_id):

    redis_client.srem(

        "online_users",

        user_id
    )
def get_online_users():

    return list(

        redis_client.smembers(
            "online_users"
        )
    )