from rest_framework import serializers
from .models import ChatRoom


class ChatRoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatRoom

        fields = [
            'id',
            'created_by',
            'room_name',
            'description',
            'room_image',
            'room_type',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_by',
            'created_at'
        ]

        extra_kwargs = {
            'room_image': {'required': False}
        }

    def validate_room_name(self, room_name):

        if len(room_name) < 4:
            raise serializers.ValidationError(
                "Room name must be at least 4 characters long"
            )

        return room_name