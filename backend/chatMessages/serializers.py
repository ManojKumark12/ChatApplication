from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):

    sender_name = serializers.CharField(
        source='sender.username',
        read_only=True
    )

    sender_photo = serializers.ImageField(
        source='sender.profile_photo',
        read_only=True
    )

    class Meta:

        model = Message

        fields = [
            'id',
            'room',
            'sender',
            'sender_name',
            'sender_photo',
            'content',
            'sent_at'
        ]

        read_only_fields = [
            'sender',
            'sent_at'
        ]