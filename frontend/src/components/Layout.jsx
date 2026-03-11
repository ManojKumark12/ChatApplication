import { Outlet, useLocation, useNavigate } from "react-router-dom"
const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const SwapPage = () => {
        navigate(location.pathname === "/" ? "/personal-chats" : "/")
    }
    return (
        <div>


            <div>
                Search Bar
                <span>
                    <button onClick={SwapPage}>Swap</button>
                </span>
            </div>
            <Outlet />

        </div>

    )
}
export default Layout