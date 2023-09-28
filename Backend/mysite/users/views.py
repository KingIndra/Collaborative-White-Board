# accounts/views.py

from django.contrib.auth import authenticate
from django.db import connection

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer

cursor = connection.cursor()

def get_token(user):
    cursor.execute(f'select t.key from authtoken_token as t where t.user_id = {user.id};')
    token = cursor.fetchone()[0]
    return token

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data = request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user = user)
        raw_token = get_token(user)
        return Response({'token': token.key, 'raw_token': raw_token}, status = status.HTTP_200_OK)
    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username = username, password = password)
        if user:
            token, _ = Token.objects.get_or_create(user = user)
            raw_token = get_token(user)
            return Response({'token': token.key, 'raw_token': raw_token}, status = status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status = status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    if request.method == 'POST':
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status = status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    raw_token = get_token(user)
    return Response({"username":user.username})