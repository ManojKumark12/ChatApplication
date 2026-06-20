from .redis_client import redis_client

ONLINE_USERS_KEY = "online_users"

async def set_online(user_id):

    await redis_client.sadd(

       ONLINE_USERS_KEY,

        user_id
    )

async def set_offline(user_id):

    await redis_client.srem(

        ONLINE_USERS_KEY,

        user_id
    )

async def get_online_users():

    return list(

        map(
            int,

            await redis_client.smembers(
                ONLINE_USERS_KEY
            )
        )
    )