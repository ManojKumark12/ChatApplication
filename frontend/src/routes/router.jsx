import { createBrowserRouter } from "react-router-dom"
import Layout from "../components/Layout"
import ChatRooms from "../components/ChatRooms"
import PersonalChats from "../components/PersonalChats"
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
    }
  ]
}
])

export default router