from django.db import models
from django.contrib.auth.models import User


class Room(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return self.name

class Canvas(models.Model):
    image = models.TextField(null=True, blank=True, default="")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return self.room.name
    

class Thread(models.Model):
    room = models.OneToOneField(Room, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return self.room.name

class Message(models.Model):
    text = models.TextField(null=True, blank=True, default="")
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.text} from {self.user.username} at {self.thread.room.name}"