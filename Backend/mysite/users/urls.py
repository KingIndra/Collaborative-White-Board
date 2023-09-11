from django.urls import path
from .views import register_user, user_login, user_logout, profile

urlpatterns = [
    path('register/', register_user, name='register'),
    path('profile/', profile, name='profile'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
]