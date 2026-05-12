import { createBrowserRouter } from "react-router-dom"
import Layout from "../pages/Layout"
import ChatRooms from "../pages/ChatRooms"
import PersonalChats from "../pages/PersonalChats"
import RoomInner from "../pages/RoomInner"
import PersonalChatInner from "../pages/PersonalChatInner"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import ChatRoomTemplate from "../pages/ChatRoomTemplate"
const router = createBrowserRouter([
  {
path:'/signup',
element:<Signup />
  },
    {
path:'/login',
element:<Login />
  },
{
  path: "/",
  element: <Layout />,
  children: [
    {
      index: true,
      element: <ChatRooms />
    },
    {
      path: "personal-chats",
      element: <PersonalChats />
    },
    {
      path:'room-inner/:roomId',
      element:<RoomInner />
    },
    {
      path:'personal-chat-inner',
      element:<PersonalChatInner />
    },
    {
      path:'chatRoomTemplate',
      element:<ChatRoomTemplate />
    }
  ]
}
])

export default router