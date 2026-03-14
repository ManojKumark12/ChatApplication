import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { navigateTo } from "../components/helper_functions";
const Layout = () => {
    const location = useLocation();
    const swap_location_path=location.pathname === "/" ? "/personal-chats" : "/"
    const navigate = useNavigate();

    return (
        <div className="app-viewport">
            <nav className="top-nav">
                {/* Modernized Search Bar */}
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search for players or rooms..." 
                        className="search-input"
                    />
                </div>

                <div className="nav-actions" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button className="swap-btn" onClick={()=>navigateTo(navigate,swap_location_path)}>
                        {location.pathname === "/" ? "Personal Chats" : "Public Rooms"}
                    </button>
                    
                    {/* Tiny User Avatar for extra "Cool" factor */}
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #ddd, #fff)', 
                        border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}></div>
                </div>
            </nav>

            <main className="page-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;