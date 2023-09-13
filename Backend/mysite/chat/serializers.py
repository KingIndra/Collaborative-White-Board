from rest_framework import serializers
from .models import Room, Message


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['name', 'user']

    def create(self, vaildated_data):
        room, _ = Room.objects.get_or_create(**vaildated_data)
        return room