from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import ChatRoomSerializer
from rest_framework.response import Response
from .models import ChatRoom


class CreateRoom(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChatRoomSerializer(data=request.data)

        if serializer.is_valid():

            room=serializer.save(created_by=request.user)
            room.members.add(request.user)

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class Rooms(APIView):

    def get(self, request):

        rooms = ChatRoom.objects.all()

        serializer = ChatRoomSerializer(rooms, many=True)
        # final_data=serializer.data
        # final_dat

        return Response(serializer.data, status=200)