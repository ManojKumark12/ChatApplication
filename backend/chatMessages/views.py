from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Message
from .serializers import MessageSerializer
from chatRooms.models import ChatRoom
from infrastructure.redis.sync_redis.redis_client_sync import redis_client
import json
class RoomMessages(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):

        try:

            room = ChatRoom.objects.get(id=room_id)

        except ChatRoom.DoesNotExist:

            return Response(
                {"error": "Room not found"},
                status=404
            )

        if not room.members.filter(
            id=request.user.id
        ).exists():

            return Response(
                {"error": "You are not a member of this room"},
                status=403
            )

        cache_key = f"room:{room_id}:messages"

        cached_messages = redis_client.get(cache_key)

        if cached_messages:

            return Response(
                json.loads(cached_messages)
            )

        messages = Message.objects.filter(
            room_id=room_id
        ).order_by("sent_at")

        serializer = MessageSerializer(
            messages,
            many=True
        )

        redis_client.setex(
            cache_key,
            300,  # 5 minutes
            json.dumps(serializer.data)
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

        if not room.members.filter(
            id=request.user.id
        ).exists():

            return Response(
                {"error": "Join the room first"},
                status=403
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

        redis_client.delete(
            f"room:{room_id}:messages"
        )

        serializer = MessageSerializer(message)

        return Response(serializer.data)