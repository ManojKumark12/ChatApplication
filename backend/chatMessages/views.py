from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Message
from .serializers import MessageSerializer
from chatRooms.models import ChatRoom


class RoomMessages(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):

        messages = Message.objects.filter(
            room_id=room_id
        ).order_by('sent_at')

        serializer = MessageSerializer(
            messages,
            many=True
        )

        return Response(serializer.data)


class SendMessage(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):

        try:

            room = ChatRoom.objects.get(id=room_id)

        except ChatRoom.DoesNotExist:

            return Response(
                {"error": "Room not found"},
                status=404
            )

        content = request.data.get("content")

        if not content:

            return Response(
                {"error": "Message cannot be empty"},
                status=400
            )

        message = Message.objects.create(
            room=room,
            sender=request.user,
            content=content
        )

        serializer = MessageSerializer(message)

        return Response(serializer.data)