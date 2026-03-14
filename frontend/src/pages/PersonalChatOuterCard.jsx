import { useNavigate } from "react-router-dom";
import { navigateTo } from "../components/helper_functions";
export const PersonalChatOuterCard = ({ name, recentMessage = 'Hi', read = false }) => {
    // Generates a consistent color based on the name
    const avatarColor = name.length % 2 === 0 ? '#6366f1' : '#f43f5e';
    const navigate=useNavigate()
    return (
        <div className={`PersonalChatCard ${read ? 'read' : 'unread'}`} onClick={()=>{navigateTo(navigate,"/personal-chat-inner")}}>
            {/* Profile Picture Placeholder */}
            <div className="avatar" style={{ background: avatarColor }}>
                {name.charAt(0)}
            </div>

            <div className="chat-content">
                <div className="chat-header">
                    <span className="chat-name">{name}</span>
                    <span className="chat-time">12:45 PM</span>
                </div>
                
                <div className={`chat-message ${!read ? 'bold-text' : ''}`}>
                    {recentMessage}
                </div>
            </div>

            {!read && <div className="unread-dot"></div>}
        </div>
    );
};