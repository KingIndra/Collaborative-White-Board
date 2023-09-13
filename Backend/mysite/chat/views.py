from django.shortcuts import render


def index(request):
    return render(request, "chat/index.html")


def room(request, room_name):
    context = {"room_name": room_name}
    return render(request, "chat/room.html", context)


from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import RoomSerializer
from .models import Room, Canvas, Message


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    serializer = RoomSerializer(data = request.data)
    if serializer.is_valid(): 
        room = serializer.save()
        room.user = request.user
        room.save()
    else:
        return Response({"eroor error"})
    return Response({"room_name": room.name, "created_by":room.user.username})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_canvas(request):
    data = request.data
    try:
        print(data['room_name'])
        room = Room.objects.get(name = data['room_name'])
    except Room.DoesNotExist:
        return Response({"message":"Room Does Not Exist"})
    canvas, _ = Canvas.objects.get_or_create(room = room)
    return Response({"image":canvas.image})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_messages(request):
    data = request.data
    print(data['room_name'])
    messages = Message.objects.filter(thread__room__name = data['room_name'])
    def mapping(message):
        return {
            "id": message.id,
            "text": message.text,
            "user": message.user.username
        }
    messages = list(map(mapping, messages))
    return Response(messages)