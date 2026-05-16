from rest_framework import serializers
from .models import ChatRoom
from Users.models import User


class RoomMemberSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            'id',
            'username',
            'email','profile_photo'
        ]


class ChatRoomSerializer(serializers.ModelSerializer):

    total_members = serializers.SerializerMethodField()

    owner = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    members = RoomMemberSerializer(
        many=True,
        read_only=True
    )
    is_member = serializers.SerializerMethodField()

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
            'total_members',
            'owner',
            'members',
            'is_member'
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

    def get_total_members(self, obj):

        return obj.members.count()
    def get_is_member(self, obj):

        request = self.context.get("request")

        if request and request.user.is_authenticated:

            return obj.members.filter(
                id=request.user.id
            ).exists()

        return False