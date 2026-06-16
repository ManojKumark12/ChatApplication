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
# For normal API requests, this happens:

# Browser
#    ↓
# HTTP Request
#    ↓
# DRF Authentication
#    ↓
# request.user

# custom authentication class:
# CookieJWTAuthentication runs automatically for API views.That's why inside a view, you can do:request.user and get the logged-in user
# But WebSockets are different.

# When the browser opens:

# ws://localhost:8000/ws/chat/8/

# the request flow is:

# Browser
#    ↓
# Daphne
#    ↓
# ASGI
#    ↓
# Consumer

# Notice:DRF Authentication never runs.
# Therefore:self.scope["user"] becomes:AnonymousUser ,Your middleware's job is to solve this problem.
# What Is scope?
# Think of scope as the WebSocket equivalent of request.
# HTTP:

# request.user
# request.headers
# request.path

# WebSocket:

# scope["user"]
# scope["headers"]
# scope["path"]

# So this:
# scope["user_id"] = 12

# is similar to:

# request.user_id = 12
