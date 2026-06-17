from .redis_client import redis_client
from channels.db import database_sync_to_async

ONLINE_USERS_KEY = "online_users"
@database_sync_to_async
def set_online(user_id):

    redis_client.sadd(

       ONLINE_USERS_KEY,

        user_id
    )
@database_sync_to_async
def set_offline(user_id):

    redis_client.srem(

        ONLINE_USERS_KEY,

        user_id
    )
@database_sync_to_async
def get_online_users():

    return list(

        map(
            int,

            redis_client.smembers(
                ONLINE_USERS_KEY
            )
        )
    )