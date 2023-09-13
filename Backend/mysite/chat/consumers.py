from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Canvas, Room, Thread, Message


# Drawing Handler

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
        self.group_name = "Draw_" + self.scope['url_route']['kwargs']['room_name']
        await RoomAPI.save(self.group_name)
        # 
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, data):
        await CanvasAPI.save(self.group_name, data["message"])
        event = {"type": "chat.message", "message": data["message"]}
        await self.channel_layer.group_send(self.group_name, event)

    async def chat_message(self, event):
        message = event["message"]
        await self.send_json(message)


# Chat Message Handler

class ThreadAPI:
    @database_sync_to_async
    def save(self, room_name):
        room = Room.objects.get(name = room_name)
        thread, _ = Thread.objects.get_or_create(room = room)
        return thread

class MessageAPI:
    @database_sync_to_async
    def save(self, text, room_name, user):
        thread = Thread.objects.get(room__name = room_name)
        message = Message.objects.create(text = text, thread = thread, user= user)
        return message

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        # 
        self.user = self.scope['user'] 
        if not self.user.is_authenticated:
            return
        # 
        self.group_name = "Draw_" + self.scope['url_route']['kwargs']['room_name']
        await ThreadAPI.save(self.group_name)
        # 
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, data):
        await MessageAPI.save(data["message"], self.group_name, self.user)
        event = {"type": "chat.message", "message": {"text":data["message"], "user":self.user.username}}
        await self.channel_layer.group_send(self.group_name, event)

    async def chat_message(self, event):
        message = event["message"]
        await self.send_json(message)