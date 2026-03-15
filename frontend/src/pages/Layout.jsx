import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { navigateTo } from "../common/helper_functions";
import { useState,useRef,useEffect } from "react";
import { Link } from "react-router-dom";
const Layout = () => {
    const location = useLocation();
    const swap_location_path = location.pathname === "/" ? "/personal-chats" : "/"
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const avatarRef = useRef(null);

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
                            className="avatar"
                            onClick={() => setMenuOpen(!menuOpen)}
                        />

                        {menuOpen && (
                            <div className="avatar-dropdown">
                                <button className="dropdown-item">Profile</button>
                                <Link to='/login'><button className="dropdown-item">Login</button></Link>
                                <button className="dropdown-item">Logout</button>
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