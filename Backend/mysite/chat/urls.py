# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:room_name>/", views.room, name="room"),
    path("room/create/", views.create_room, name="create_room"),
    path("room/get_canvas/", views.get_canvas, name="get_canvas"),
    path("room/get_messages/", views.get_messages, name="get_messages"),
]