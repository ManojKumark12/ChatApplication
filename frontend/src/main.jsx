import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import router from "./routes/router"
import "./index.css"   // 👈 add this line
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import  store  from './redux/store'
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
          <ToastContainer position="top-right" autoClose={2000} />
      <RouterProvider router={router} />
        </Provider>

  </StrictMode>,
)
