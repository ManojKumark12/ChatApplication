from django.urls import path
from .views import RoomMessages, SendMessage


urlpatterns = [

    path(
        'room/<int:room_id>/',
        RoomMessages.as_view()
    ),

    path(
        'send/<int:room_id>/',
        SendMessage.as_view()
    ),
]