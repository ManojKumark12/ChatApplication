import json

from channels.generic.websocket import (
    AsyncWebsocketConsumer
)

from channels.db import (
    database_sync_to_async
)

from .models import Message

from chatRooms.models import ChatRoom

from Users.models import User


class ChatConsumer(
    AsyncWebsocketConsumer
):

    async def connect(self):

        self.room_id = self.scope[
            'url_route'
        ]['kwargs']['room_id']

        self.room_group_name = (
            f"chat_{self.room_id}"
        )

        await self.channel_layer.group_add(

            self.room_group_name,

            self.channel_name
        )

        await self.accept()

        print(
            f"CONNECTED TO ROOM {self.room_id}"
        )

    async def disconnect(
        self,
        close_code
    ):

        await self.channel_layer.group_discard(

            self.room_group_name,

            self.channel_name
        )

        print(
            f"DISCONNECTED FROM ROOM {self.room_id}"
        )

    async def receive(
        self,
        text_data
    ):

        data = json.loads(text_data)

        print("MESSAGE RECEIVED")

        print(data)

        message = data['message']

        sender_id = data['sender_id']

        saved_message = await self.save_message(

            sender_id,

            self.room_id,

            message
        )

        await self.channel_layer.group_send(

            self.room_group_name,

            {
                'type': 'chat_message',

                'id':
                    saved_message.id,

                'content':
                    saved_message.content,

                'sender':
                    saved_message.sender.id,

                'sender_name':
                    saved_message.sender.username,

                'sender_photo':

                    saved_message.sender.profile_photo.url

                    if saved_message.sender.profile_photo

                    else None,

                'sent_at':

                    saved_message.sent_at.strftime(
                        "%I:%M %p"
                    )
            }
        )

    async def chat_message(
        self,
        event
    ):

        await self.send(
            text_data=json.dumps({

                'id':
                    event['id'],

                'content':
                    event['content'],

                'sender':
                    event['sender'],

                'sender_name':
                    event['sender_name'],

                'sender_photo':
                    event['sender_photo'],

                'sent_at':
                    event['sent_at']
            })
        )

    @database_sync_to_async
    def save_message(
        self,
        sender_id,
        room_id,
        message
    ):

        sender = User.objects.get(
            id=sender_id
        )

        room = ChatRoom.objects.get(
            id=room_id
        )

        return Message.objects.create(

            sender=sender,

            room=room,

            content=message
        )