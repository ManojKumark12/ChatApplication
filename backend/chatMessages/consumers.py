import json

from channels.generic.websocket import (
    AsyncWebsocketConsumer
)

from channels.db import (
    database_sync_to_async
)
from infrastructure.redis.users_status import set_online,set_offline, get_online_users
from infrastructure.redis.rate_limiting import rate_limit_check
from .models import Message

from chatRooms.models import ChatRoom

from Users.models import User


class ChatConsumer(AsyncWebsocketConsumer):  

    async def connect(self):

        self.room_id = self.scope[
            'url_route'
        ]['kwargs']['room_id']

        self.room_group_name = (
            f"chat_{self.room_id}"
        )
        print(self.scope["user_id"])
        await self.channel_layer.group_add(#this is established as soon as the user opens chat room page with the help of useEffect,that too if joined in grp only

            self.room_group_name,

            self.channel_name    #each socket has a channel name,i.e each user has a socket connection,so each socket has channel name which is identifier of that socket,so here we are creating a group in channel layer with the id of the room(if not exists) and adding user connection to it.
        )

        await self.accept()

        print(
            f"CONNECTED TO ROOM {self.room_id}"
        )
        user_id = int(self.scope["user_id"])

        await set_online(user_id)
        online_users=await get_online_users()
        await self.send(
                text_data=json.dumps({

                    "event":
                        "users_status",

                    "online_users":
                        online_users
                })
            )
        await self.channel_layer.group_send(

            self.room_group_name,

            {
                "type":
                    "status_update",

                "user_id":
                    user_id,

                "status":
                    "online"
            }
        )

    async def disconnect(self,close_code):##this executes when room id changes or when user leaves from room or component in react changes,that is in frontend see ws.close() which was returned to react,which executes when depedencies of useeffect changes,Before running the new effect it runs ws.close()

        await self.channel_layer.group_discard(

            self.room_group_name,

            self.channel_name
        )

        print(
            f"DISCONNECTED FROM ROOM {self.room_id}"
        )
        user_id = int(self.scope["user_id"])
        await set_offline(user_id)
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type":
                        "status_update",

                    "user_id":
                        user_id,

                    "status":
                        "offline"
                }
            )

    async def receive(self,text_data):
        sender_id = int(self.scope["user_id"])

        data = json.loads(text_data)

        if "event" in data and data["event"] == "typing":

            await self.channel_layer.group_send(

                self.room_group_name,

                {
                    "type": "typing_update",

                    "user_id": sender_id,

                    "username": data["username"],

                    "status": "typing"
                }
            )

            return


        if "event" in data and data["event"] == "stop_typing":

            await self.channel_layer.group_send(

                self.room_group_name,

                {
                    "type": "typing_update",

                    "user_id": sender_id,

                    "username": data["username"],

                    "status": "stopped"
                }
            )

            return

        # print("MESSAGE RECEIVED")

        # print(data)

        message = data['message']

        # sender_id = data['sender_id']

        ##Rate Limit Check
        proceed=rate_limit_check(f"rate_limit:messages:user:user_id:{sender_id}",action='chat_messages')
        if not proceed:
            await self.send(
            text_data=json.dumps({
                "event": "error",
                "message": "Too many messages. Please wait."
            })
        )
            return
        # print("Saving message.....")
        saved_message = await self.save_message(

            sender_id,

            self.room_id,

            message
        )
        # print("yoyoyyoyo")
        await self.channel_layer.group_send(#so this function is like a loop:self.channel_layer.group_send(,i.e each consumers channel instance is stored in the group mentioned in group_send(),so every consumer instance gets this info about message and function to execute,and then each consumer executes chat_message() separately,

            self.room_group_name,

            {
                'type': 'chat_message',#telling to execute chat_message() function for every connection in the group,then in frontend ws.onmessage() receives this

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
    async def members_update(self,event):
         await self.send(
              text_data=json.dumps({
                   'event':"members_update",
                   'action':event["action"],
                   'user_id':event['user_id']

              })
         )
    async def chat_message(self,event):

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
    def save_message(self,sender_id,room_id,message):

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
    async def status_update(self,event):

            await self.send(
                text_data=json.dumps({

                    "event":
                        "status_update",

                    "user_id":
                        event["user_id"],

                    "status":
                        event["status"]
                })
            )
    async def typing_update(self, event):

        await self.send(
            text_data=json.dumps({

                "event": "typing_update",

                "user_id": event["user_id"],

                "username": event["username"],

                "status": event["status"]
            })
        )