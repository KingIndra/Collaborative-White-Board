from django.contrib import admin
from .models import Room, Canvas, Thread, Message
# Register your models here.

admin.site.register(Room)
admin.site.register(Canvas)
admin.site.register(Thread)
admin.site.register(Message)