from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from http.cookies import SimpleCookie

class JWTAuthMiddleware(
    BaseMiddleware
):

    async def __call__(
        self,
        scope,
        receive,
        send
    ):
        headers = dict(
            scope["headers"]
        )

        cookie_header = headers.get(
            b"cookie"
        )
        cookies = SimpleCookie()

        cookies.load(
            cookie_header.decode()
        )

        access_token=cookies["access"].value
        token = AccessToken(
            access_token
        )

        # print(token)
        scope["user_id"]=(token["user_id"])
        return await super().__call__(
            scope,
            receive,
            send
        )