from django.contrib import admin
from django.urls import path
from .views import Signup,Logout,Login
urlpatterns = [
    path('signup/',Signup.as_view()),
        path('logout/',Logout.as_view()),
        path('login/',Login)

]