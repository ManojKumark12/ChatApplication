from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import ChatRoomSerializer
from rest_framework.response import Response
from .models import ChatRoom

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

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

    def get(self, request, room_id=None):

        if room_id:

            room = ChatRoom.objects.get(id=room_id)

            serializer = ChatRoomSerializer(
                room,
                context={"request": request}
            )

            return Response(serializer.data)

        rooms = ChatRoom.objects.all()

        serializer = ChatRoomSerializer(
            rooms,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)

class JoinRoom(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):

        try:

            room = ChatRoom.objects.get(id=room_id)
            channel_layer = get_channel_layer()



        except ChatRoom.DoesNotExist:

            return Response(
                {"error": "Room not found"},
                status=404
            )

        already_joined = room.members.filter(
            id=request.user.id
        ).exists()

        # Leave room
        if already_joined:

            room.members.remove(request.user)
            async_to_sync(channel_layer.group_send)(
                f"chat_{room_id}",
                {
                    "type": "members_update",
                    
                    "action":"left",
                    "user_id": request.user.id
                }
            )

            return Response(
                {
                    "message": "Left room successfully",
                    "join": False
                },
                status=200
            )

        # Join room
        room.members.add(request.user)
        async_to_sync(channel_layer.group_send)(
                f"chat_{room_id}",
                {
                    "type": "members_update",
                    "action":"joined",
                    "user_id": request.user.id
                }
            )
        
        return Response(
            {
                "message": "Joined room successfully",
                "join": True
            },
            status=200
        )   