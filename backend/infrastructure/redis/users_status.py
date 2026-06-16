from .redis_client import redis_client


ONLINE_USERS_KEY = "online_users"
def set_online(user_id):

    redis_client.sadd(

       ONLINE_USERS_KEY,

        user_id
    )
def set_offline(user_id):

    redis_client.srem(

        ONLINE_USERS_KEY,

        user_id
    )
def get_online_users():

    return list(

        map(
            int,

            redis_client.smembers(
                ONLINE_USERS_KEY
            )
        )
    )