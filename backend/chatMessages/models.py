from django.db import models
from django.conf import settings
from chatRooms.models import ChatRoom


class Message(models.Model):

    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='messages'
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='messages'
    )

    content = models.TextField()

    sent_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.sender.username}: {self.content[:20]}"