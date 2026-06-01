# WebSocket Doubts Explanation

## 1) What is WebSocket?

WebSocket is a persistent two-way connection between:
- browser
- backend

Unlike REST:
- connection stays open continuously.

Both frontend and backend can send data anytime.

---

## REST

Request → Response → Close

---

## WebSocket

Open once
stay connected
send anytime
receive anytime

---

## 2) Why Regex in routing.py?

```python
r'ws/chat/(?P<room_id>\d+)/$'
```

Purpose:
- match websocket URL
- extract room_id.

Example:

ws/chat/8/

gives:

```python
room_id = 8
```

---

## 3) Why self.accept()?

Browser first asks:

"Can I connect?"

Backend must approve.

```python
await self.accept()
```

means:

"Connection accepted"

Without this:
- websocket closes immediately.

---

## 4) What is Channel Layer?

Channel layer is a shared system managing websocket groups.

It stores:

chat_8:
   channel1
   channel2
   channel3

Without it:
- broadcasting impossible.

---

## 5) Why chat_message() if group_send() exists?

group_send() only broadcasts EVENT.

It does NOT directly send websocket data.

This:

```python
'type': 'chat_message'
```

tells Channels:

"Call chat_message()"

Then:
- chat_message()
- uses self.send()
- sends websocket data to frontend.

---

## 6) When are functions called?

WebSockets are event-driven.

Functions automatically run when events happen.

### Frontend

#### onopen

Runs automatically when websocket connects.

#### onmessage

Runs automatically when backend sends websocket data.

#### onclose

Runs automatically when websocket closes.

### Backend

#### connect()

Runs automatically when websocket connects.

#### receive()

Runs automatically when frontend sends websocket data.

#### chat_message()

Runs automatically when group_send() triggers event.

#### sendMessage()

Only manually called function.

Runs when user clicks Send button.

---

## Full Flow

Frontend opens room
↓
WebSocket connects
↓
connect()
↓
User clicks Send
↓
sendMessage()
↓
socket.send()
↓
receive()
↓
group_send()
↓
chat_message()
↓
onmessage()
↓
setMessages()
↓
UI updates instantly