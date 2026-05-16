import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { navigateTo } from "../common/helper_functions";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import apiFetch from "../common/apiFetch";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logoutfunc } from "../redux/User.slice";
const Layout = () => {
    
    const location = useLocation();
    const swap_location_path = location.pathname === "/" ? "/personal-chats" : "/"
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const avatarRef = useRef(null);

const dispatch = useDispatch();
const { isloggedin, user } = useSelector(
    (state) => state.user
);
    // close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logout = async (e) => {
        const response = await apiFetch(
            `${import.meta.env.VITE_API_URL}/user/logout/`,
            {
                method: "POST",
                credentials: "include",
            }
        );
        if (response.ok) {
            dispatch(logoutfunc());
            toast.success("Loggged out successfully!");
            // navigateTo(navigate, '/login')

        }
        else {
            toast.error("Log Out unsuccess!");

        }
    }
    return (
        
        <div className="app-viewport">
            <nav className="top-nav">

                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search for players or rooms..."
                        className="search-input"
                    />
                </div>

                <div className="nav-actions" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button className="swap-btn" onClick={() => navigateTo(navigate, swap_location_path)}>
                        {location.pathname === "/" ? "Personal Chats" : "Public Rooms"}
                    </button>

                    <div ref={avatarRef} className="avatar-container">

                      <div
    onClick={() => setMenuOpen(!menuOpen)}
    style={{
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",
        border: "2px solid #4f46e5",
        background: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}
>

    {
        user?.profile_photo ? (

            <img
                src={`${import.meta.env.VITE_API_URL}${user.profile_photo}`}

                alt="profile"

                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }}
            />

        ) : (

            <span
                style={{
                    fontWeight: "700",
                    color: "#4f46e5",
                    fontSize: "18px"
                }}
            >
                {
                    user?.username
                        ?.charAt(0)
                        ?.toUpperCase()
                }
            </span>

        )
    }

</div>

                        {menuOpen && (
                            <div className="avatar-dropdown">
                                <Link to="/profile">
                                <button className="dropdown-item">Profile</button>
                                </Link>
                             {!isloggedin &&  <Link to='/login'><button className="dropdown-item">Login</button></Link>}
                               
                               {isloggedin && <button className="dropdown-item" onClick={logout}>Logout</button>}
                            </div>
                        )}

                    </div>
                </div>
            </nav>

            <main className="page-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;