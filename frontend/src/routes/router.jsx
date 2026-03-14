import { createBrowserRouter } from "react-router-dom"
import Layout from "../pages/Layout"
import ChatRooms from "../pages/ChatRooms"
import PersonalChats from "../pages/PersonalChats"
import RoomInner from "../pages/RoomInner"
import PersonalChatInner from "../pages/PersonalChatInner"
const router = createBrowserRouter([
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
      path:'room-inner',
      element:<RoomInner />
    },
    {
      path:'personal-chat-inner',
      element:<PersonalChatInner />
    }
  ]
}
])

export default router