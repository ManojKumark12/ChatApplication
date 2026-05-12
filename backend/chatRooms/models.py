from django.db import models
from django.conf import settings


class ChatRoom(models.Model):

    ROOM_TYPES = (
        ('public', 'Public'),
        ('private', 'Private'),
    )

    room_name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    room_image = models.ImageField(
        upload_to='chatroom_images/',
        blank=True,
        null=True
    )

    room_type = models.CharField(
        max_length=10,
        choices=ROOM_TYPES,
        default='public'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_rooms'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='joined_rooms',
        blank=True
    )

    def __str__(self):
        return self.room_name