from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Canvas, Room


class CanvasAPI:
    @database_sync_to_async
    def save(self, room_name, image):
        room = Room.objects.get(name = room_name)
        canvas, _ = Canvas.objects.get_or_create(room = room)
        canvas.image = image
        canvas.save()
        return canvas

class RoomAPI:
    @database_sync_to_async
    def save(self, room_name):
        room, _ = Room.objects.get_or_create(name = room_name)
        return room


class DrawConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        # 
        user = self.scope['user']
        if not user.is_authenticated:
            return
        # 
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        await RoomAPI.save(self.room_name)
        # 
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive_json(self, data):
        await CanvasAPI.save(self.room_name, data["message"])
        event = {"type": "chat.message", "message": data["message"]}
        await self.channel_layer.group_send(self.room_name, event)

    async def chat_message(self, event):
        message = event["message"]
        await self.send_json(message)