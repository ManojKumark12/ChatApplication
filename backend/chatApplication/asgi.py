import os

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'chatApplication.settings'
)

from django.core.asgi import (
    get_asgi_application
)

django_asgi_app = get_asgi_application()


from channels.routing import (
    ProtocolTypeRouter,
    URLRouter
)

from channels.auth import (
    AuthMiddlewareStack
)
from Users.jwt_authentication_web_sockets import (
    JWTAuthMiddleware
)
import chatMessages.routing


application = ProtocolTypeRouter({

    "http":
        django_asgi_app,####Normal Asgi Flow,redirection

    "websocket":

        JWTAuthMiddleware(

            URLRouter(

                chatMessages.routing.websocket_urlpatterns##More routings can be added.
            )
        ),
})