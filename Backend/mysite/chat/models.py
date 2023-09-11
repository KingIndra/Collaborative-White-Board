from django.db import models
from django.contrib.auth.models import User


class Room(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)


class Canvas(models.Model):
    image = models.TextField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)