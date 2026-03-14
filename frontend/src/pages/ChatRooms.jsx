import { RoomOuterCard } from "./RoomOuterCard";

const ChatRooms = () => {
    return (
        <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ marginLeft: '15px', color: '#444' }}>Available Rooms</h2>
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