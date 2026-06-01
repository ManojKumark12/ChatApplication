# Realtime Chat Application — Full WebSocket Code Explanation

## Goal

Transform normal REST-based chat into realtime messaging using:
- Django Channels
- WebSockets
- Daphne
- React

---

## BEFORE WEBSOCKETS

The application originally worked like this:

Frontend → HTTP Request → APIView → Database → HTTP Response

Messages were sent using REST APIs.

---

## Problem

Suppose:
- Manoj sends message
- Ram is also inside room

Ram could not see new message instantly.

Why?

Because REST APIs only work when frontend asks backend.

Backend cannot push data automatically.

---

## WHY WEBSOCKETS?

WebSockets create a persistent bidirectional connection.

Meaning:
- frontend can send anytime
- backend can send anytime

without reopening connections repeatedly.

---

## ARCHITECTURE

React Frontend
↓
WebSocket
↓
Daphne (ASGI Server)
↓
Django Channels
↓
Consumers
↓
PostgreSQL

---

## INSTALL CHANNELS

```bash
pip install channels
```

Purpose:
- Adds websocket support to Django
- Adds async communication
- Adds realtime event system

---

## INSTALL DAPHNE

```bash
pip install daphne
```

Purpose:
- ASGI server
- Handles websocket protocol

WSGI cannot properly handle realtime websocket connections.

---

## settings.py Changes

### Added Apps

```python
INSTALLED_APPS = [
    'daphne',
    'channels',
]
```

### ASGI_APPLICATION

```python
ASGI_APPLICATION = "chatApplication.asgi.application"
```

Purpose:
- tells Django to use ASGI entrypoint.

### CHANNEL_LAYERS

```python
CHANNEL_LAYERS = {

    "default": {

        "BACKEND":
            "channels.layers.InMemoryChannelLayer"
    }
}
```

Purpose:
- stores websocket groups
- manages broadcasts

Without this:

```python
self.channel_layer
```

becomes None which caused:

'NoneType' object has no attribute group_add'

---

## asgi.py

Purpose:
- main entrypoint for websocket traffic.

### ProtocolTypeRouter

```python
ProtocolTypeRouter({
```

checks request type.

### HTTP Requests

```python
"http": django_asgi_app
```

go to normal Django system.

### WebSocket Requests

```python
"websocket":
```

go to websocket routing system.

### URLRouter

```python
URLRouter(
    chatMessages.routing.websocket_urlpatterns
)
```

Purpose:
- routes websocket URLs to consumers.

Equivalent of:
- urls.py for websockets.

---

## routing.py

```python
re_path(
    r'ws/chat/(?P<room_id>\d+)/$',
    ChatConsumer.as_asgi()
)
```

Purpose:
- match websocket URLs
- extract room_id
- send request to ChatConsumer

Example:

ws/chat/8/

extracts:

```python
room_id = 8
```

---

## Consumer

Consumer is websocket version of APIView.

### connect()

Runs automatically when websocket connects.

Tasks:
- get room_id
- create group name
- join room group
- accept connection

### room_group_name

```python
self.room_group_name = f"chat_{self.room_id}"
```

Example:

chat_8

Each room gets unique websocket group.

### group_add()

```python
await self.channel_layer.group_add(
```

Purpose:
- add current socket into room group.

### accept()

```python
await self.accept()
```

Purpose:
- approve websocket connection.

Without this:
- browser connection rejected.

### disconnect()

Runs when:
- tab closes
- page refreshes
- websocket closes.

Purpose:
- remove socket from group.

### receive()

Runs automatically when frontend sends websocket data.

Purpose:
- parse JSON
- save message
- broadcast message

### save_message()

Stores messages into PostgreSQL.

Used:

```python
@database_sync_to_async
```

because:
- consumer is async
- Django ORM is sync.

### group_send()

```python
await self.channel_layer.group_send(
```

Purpose:
- broadcast event to all users in room.

### type

```python
'type': 'chat_message'
```

means:

```python
chat_message()
```

should run.

Channels automatically maps:
- type
→ method name.

### chat_message()

Runs for all users in room.

Purpose:
- send websocket data to frontend.

Uses:

```python
await self.send()
```

---

## Frontend WebSocket

### Creating Socket

```js
const ws = new WebSocket(
    `ws://localhost:8000/ws/chat/${roomId}/`
);
```

Purpose:
- open realtime websocket connection.

### onopen

```js
ws.onopen = () => {}
```

Runs automatically when websocket connects.

### onmessage

```js
ws.onmessage = (event) => {}
```

Runs automatically whenever backend sends websocket data.

### onclose

```js
ws.onclose = () => {}
```

Runs when websocket closes.

### Sending Message

```js
socket.send(
    JSON.stringify({
        message: messageInput,
        sender_id: user.id
    })
);
```

Purpose:
- send realtime websocket data to backend.

---

## Final Message Flow

Click Send
↓
socket.send()
↓
Backend receive()
↓
save_message()
↓
group_send()
↓
chat_message()
↓
Frontend onmessage()
↓
setMessages()
↓
Realtime UI Update