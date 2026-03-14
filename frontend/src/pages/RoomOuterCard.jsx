import { useNavigate } from "react-router-dom";
import { navigateTo } from "../components/helper_functions";
export const RoomOuterCard = ({ title, total, active }) => {
    const navigate=useNavigate()
    return (
        <div className="RoomOuterCard" onClick={()=>{navigateTo(navigate,"/room-inner")}}>
            <div className="room-title">{title || "Unnamed Room"}</div>
            <div className="room-info-container">
                <div className="room-stats">Members: {total || 0}</div>
                <div className="status-online">{active || 0} Active Now</div>
            </div>
        </div>
    );
};