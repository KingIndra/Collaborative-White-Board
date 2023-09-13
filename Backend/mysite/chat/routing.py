# chat/routing.py
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.DrawConsumer.as_asgi()),
    re_path(r"ws/chat/text/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
    # path("ws/test/", consumers.DrawConsumer.as_asgi()),
]