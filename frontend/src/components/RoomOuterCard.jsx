import { useNavigate } from "react-router-dom";

export const RoomOuterCard = ({ title, total, active }) => {
    const navigate=useNavigate()
    const goToRoom=()=>{
        navigate("/room-inner")
    }
    return (
        <div className="RoomOuterCard" onClick={goToRoom}>
            <div className="room-title">{title || "Unnamed Room"}</div>
            <div className="room-info-container">
                <div className="room-stats">Members: {total || 0}</div>
                <div className="status-online">{active || 0} Active Now</div>
            </div>
        </div>
    );
};