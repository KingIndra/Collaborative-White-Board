import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from chat.routing import websocket_urlpatterns
from chat.middleware import TokenAuthMiddleWare

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": TokenAuthMiddleWare(
            AllowedHostsOriginValidator(
                URLRouter(
                    websocket_urlpatterns
                )
            )
        ),
        # "websocket": AllowedHostsOriginValidator(
        #     AuthMiddlewareStack(
        #         URLRouter(websocket_urlpatterns)
        #     )
        # ),
    }
)
