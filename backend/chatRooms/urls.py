from django.contrib import admin
from django.urls import path
from .views import CreateRoom,Rooms,JoinRoom
urlpatterns = [
    path('create/',CreateRoom.as_view()),
    path('rooms/',Rooms.as_view()),
    path('rooms/<int:room_id>/',Rooms.as_view()),
      path('join-room/<int:room_id>/',JoinRoom.as_view()),
        # path('logout/',Logout.as_view()),
        # path('login/',Login)

]