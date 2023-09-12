from django.db import models
from django.contrib.auth.models import User


class Room(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class Canvas(models.Model):
    image = models.TextField(null=True, blank=True, default="")
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.room.name