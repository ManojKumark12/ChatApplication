# Realtime Chat Migration Guide

# Project

Realtime Chat Application using:
- React
- Django REST Framework
- PostgreSQL
- Django Channels
- WebSockets
- Daphne

---

# Initial Architecture (Before WebSockets)

Initially, the application used:

```txt
React Frontend
      ↓
REST API Calls
      ↓
Django REST Framework
      ↓
PostgreSQL
```

Messages were sent using:

```js
POST /messages/send/:roomId/
```

Messages were loaded using:

```js
GET /messages/room/:roomId/
```

---

# Problem With REST-Based Messaging

When a user sent a message:

1. Message was stored in database.
2. UI updated only for sender.
3. Other users in room could NOT see message instantly.
4. They had to:
   - refresh page
   - or poll API repeatedly.

This is NOT realtime.

---

# Why REST APIs Cannot Create Realtime Chat

REST APIs work like this:

```txt
Client asks
Server responds
Connection closes
```

Example:

```txt
Frontend → Send Request
Backend → Send Response
Connection Ends
```

Realtime apps need:

```txt
Persistent connection
```

where server can ALSO send data whenever something changes.

That is why WebSockets are needed.

---

# What WebSockets Do

WebSockets create:

```txt
Two-way persistent connection
```

Meaning:

```txt
Frontend ↔ Backend
```

Both can continuously communicate.

---

# Final Realtime Architecture

```txt
React Frontend
      ↓
WebSocket Connection
      ↓
Daphne (ASGI Server)
      ↓
Django Channels
      ↓
Consumers
      ↓
PostgreSQL
```

---

# Important Difference

## REST

```txt
HTTP Request
```

handled by:

```txt
urls.py
APIView
```

---

## WebSockets

```txt
ws://
```

handled by:

```txt
asgi.py
routing.py
Consumer
```

---

# Packages Installed

## Channels

Installed:

```bash
pip install channels
```

Purpose:
- Adds async support to Django.
- Adds websocket handling.
- Adds channel layers.
- Adds realtime capabilities.

---

## Daphne

Installed:

```bash
pip install daphne
```

Purpose:
- ASGI server.
- Handles websocket protocol.
- Replaces WSGI server for realtime communication.

---

# settings.py Changes

## Added Channels

```python
INSTALLED_APPS = [
    'daphne',
    'channels',
]
```

---

## Added ASGI_APPLICATION

```python
ASGI_APPLICATION = "chatApplication.asgi.application"
```

Purpose:
- Tells Django to use ASGI entrypoint.
- Needed for websocket support.

---

## Added CHANNEL_LAYERS

```python
CHANNEL_LAYERS = {

    "default": {

        "BACKEND":
            "channels.layers.InMemoryChannelLayer"
    }
}
```

Purpose:
- Stores websocket groups.
- Enables:
  - group_add()
  - group_send()
  - group_discard()

Without this:

```txt
self.channel_layer = None
```

which caused:

```txt
'NoneType' object has no attribute group_add'
```

---

# Why Channel Layers Are Needed

Suppose room has:

```txt
Room 8
```

Users:
- User A
- User B
- User C

Channels must track:

```txt
chat_8
   → socket1
   → socket2
   → socket3
```

Channel layer stores this information.

---

# asgi.py

Final code:

```python
import os

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'chatApplication.settings'
)

from django.core.asgi import (
    get_asgi_application
)


django_asgi_app = get_asgi_application()


from channels.routing import (
    ProtocolTypeRouter,
    URLRouter
)

from channels.auth import (
    AuthMiddlewareStack
)

import chatMessages.routing


application = ProtocolTypeRouter({

    "http": django_asgi_app,

    "websocket":

        AuthMiddlewareStack(

            URLRouter(

                chatMessages.routing.websocket_urlpatterns
            )
        ),
})
```

---

# What ProtocolTypeRouter Does

It checks request type.

## HTTP Requests

```txt
http://
https://
```

go to:

```python
get_asgi_application()
```

---

## WebSocket Requests

```txt
ws://
```

go to:

```python
URLRouter(...)
```

---

# Mistake Made

## Wrong Order of Imports

Wrong:

```python
import chatMessages.routing

os.environ.setdefault(...)
```

This caused:

```txt
Requested setting AUTH_USER_MODEL, but settings are not configured
```

because models imported before Django initialized.

---

# Another Mistake

Wrong:

```python
import routing
```

before:

```python
get_asgi_application()
```

This caused:

```txt
Apps aren't loaded yet
```

because app registry was not initialized.

---

# Why get_asgi_application() Was Needed Early

This line:

```python
django_asgi_app = get_asgi_application()
```

loads:
- settings
- apps
- models
- installed apps

before importing websocket routing.

---

# routing.py

```python
from django.urls import re_path

from .consumers import ChatConsumer


websocket_urlpatterns = [

    re_path(

        r'ws/chat/(?P<room_id>\d+)/$',

        ChatConsumer.as_asgi()
    ),
]
```

---

# Purpose of routing.py

Equivalent of:

```txt
urls.py
```

for websocket requests.

---

# Important Understanding

## HTTP

```txt
Browser
   ↓
urls.py
   ↓
APIView
```

---

## WebSocket

```txt
Browser
   ↓
asgi.py
   ↓
routing.py
   ↓
Consumer
```

---

# Consumer

Consumers are websocket versions of APIViews.

Equivalent:

## REST

```python
APIView.as_view()
```

## WebSocket

```python
ChatConsumer.as_asgi()
```

---

# Final Consumer Code Structure

## connect()

Runs when websocket connects.

```python
async def connect(self):
```

Tasks:
- get room id
- join websocket group
- accept connection

---

## disconnect()

Runs when socket closes.

```python
async def disconnect(self, close_code):
```

Tasks:
- remove user from group

---

## receive()

Runs when frontend sends websocket data.

```python
async def receive(self, text_data):
```

Tasks:
- parse JSON
- save message
- broadcast to group

---

## chat_message()

Runs when group receives broadcast.

```python
async def chat_message(self, event):
```

Tasks:
- send message to frontend websocket.

---

# Why group_send() Is Needed

Suppose:

```txt
User A sends message
```

If only sender socket gets response:
- User B cannot see message.

So:

```python
group_send()
```

broadcasts message to ALL users in room.

---

# Database Saving

Messages still stored in PostgreSQL.

Used:

```python
@database_sync_to_async
```

because Django ORM is synchronous.

Websocket consumers are async.

Without this:

```txt
blocking database operations
```

would freeze event loop.

---

# Frontend Changes

---

# Added WebSocket State

```js
const [socket, setSocket] = useState(null);
```

Stores websocket connection.

---

# Added WebSocket useEffect

```js
useEffect(() => {

    const ws = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomId}/`
    );

}, []);
```

Purpose:
- connect websocket when component loads.

---

# WebSocket Lifecycle

## onopen

Runs when connected.

```js
ws.onopen = () => {}
```

---

## onmessage

Runs when backend sends message.

```js
ws.onmessage = (event) => {}
```

---

## onclose

Runs when websocket closes.

```js
ws.onclose = () => {}
```

---

# Sending Messages

Old REST method:

```js
apiFetch('/messages/send/')
```

Removed.

---

# New WebSocket Method

```js
socket.send(

    JSON.stringify({

        message: messageInput,

        sender_id: user.id
    })
);
```

---

# Mistake Made

Wrong payload:

```js
{
   sender: user.username
}
```

Backend expected:

```python
sender_id
```

This caused:

```txt
KeyError: 'sender_id'
```

---

# React Key Warning

Warning:

```txt
Each child in a list should have a unique key prop
```

Cause:
- websocket messages initially lacked id.

Fixed by sending:

```python
'id': saved_message.id
```

from backend.

---

# Final Message Flow

```txt
Frontend socket.send()
        ↓
receive()
        ↓
save_message()
        ↓
group_send()
        ↓
chat_message()
        ↓
Frontend ws.onmessage
        ↓
setMessages()
        ↓
Realtime UI update
```

---

# Why Realtime Is Faster

REST:

```txt
Request → Response → Close
```

WebSocket:

```txt
Persistent open connection
```

No repeated handshakes.

No repeated HTTP overhead.

---

# Current Features Achieved

✅ realtime messaging

✅ PostgreSQL message storage

✅ websocket rooms

✅ room groups

✅ live updates across tabs/users

✅ sender names

✅ sender profile photos

✅ timestamps

✅ instant UI updates

✅ automatic websocket cleanup

---

# Current Development Limitation

Currently using:

```python
InMemoryChannelLayer
```

This works only for:
- local development
- single server.

---

# Production Upgrade

For deployment:

Replace with:

```txt
RedisChannelLayer
```

because Redis supports:
- multiple servers
- scalability
- persistence.

---

# Final Understanding

The application evolved from:

```txt
Request-response architecture
```

to:

```txt
Event-driven realtime architecture
```

using:
- ASGI
- Channels
- Daphne
- WebSockets
- Channel Layers

This is the foundation used by:
- WhatsApp
- Discord
- Slack
- Instagram chat
- Messenger
- realtime collaboration apps
- multiplayer systems
- live dashboards.

