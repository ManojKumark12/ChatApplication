import { RoomOuterCard } from "./RoomOuterCard";
import { Link} from 'react-router-dom';

const ChatRooms = () => {


    return (
        <div
            style={{
                padding: '40px',
                backgroundColor: '#f8f9fa',
                minHeight: '100vh'
            }}
        >

            {/* Header Section */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                }}
            >
                <h2 style={{ color: '#444', margin: 0 }}>
                    Available Rooms
                </h2>

<Link to="/chatRoomTemplate">
                <button
                    // onClick={handleCreateRoom}
                    style={{
                        padding: '10px 18px',
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    + Create Room
                </button>
                </Link>
            </div>

            {/* Rooms */}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <RoomOuterCard title="PUBG GAMERS" total={30} active={10} />
                <RoomOuterCard title="Call of Duty" total={150} active={42} />
                <RoomOuterCard title="Strategy Hub" total={12} active={3} />
                <RoomOuterCard title="Minecraft Builders" total={89} active={20} />
            </div>

        </div>
    );
};

export default ChatRooms;