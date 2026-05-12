from django.contrib import admin
from django.urls import path
from .views import CreateRoom
urlpatterns = [
    path('create/',CreateRoom.as_view()),
        # path('logout/',Logout.as_view()),
        # path('login/',Login)

]