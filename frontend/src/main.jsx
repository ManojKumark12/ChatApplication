import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import router from "./routes/router"
import "./index.css"   // 👈 add this line
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
          <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
  </StrictMode>,
)
