from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Canvas


class CanvasAPI:

    @database_sync_to_async
    def create():
        canvas = Canvas.objects.get_or_create()
        return canvas
    
    @database_sync_to_async
    def get():
        canvas = Canvas.objects.get()
        return canvas
    
    @database_sync_to_async
    def save():
        canvas = Canvas.objects.get_or_create()
        return canvas


class DrawConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        user = self.scope['user']
        if not user.is_authenticated:
            return
        print(self.scope['url_route']['kwargs']['room_name'], user.username)
        self.room_group_name = "test"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, data):
        event = {"type": "chat.message", "message": data["message"]}
        await self.channel_layer.group_send(self.room_group_name, event)

    async def chat_message(self, event):
        message = event["message"]
        await self.send_json(message)