import { useEffect, useState } from "react";
import { RoomOuterCard } from "./RoomOuterCard";
import { Link } from 'react-router-dom';
import apiFetch from "../common/apiFetch";

const ChatRooms = () => {

    const [ChatRoomsData, setChatRoomsData] = useState([]);

    const loadData = async () => {

        try {

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/chatrooms/rooms/`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const result = await response.json();

            setChatRoomsData(result);

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        loadData();

    }, []);

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f4f7fb",
                padding: "40px"
            }}
        >

            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "35px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "32px",
                            color: "#222"
                        }}
                    >
                        Chat Rooms
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#666",
                            fontSize: "15px"
                        }}
                    >
                        Join communities and start chatting
                    </p>

                </div>

                <Link to="/chatRoomTemplate">

                    <button
                        style={{
                            padding: "12px 22px",
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "15px",
                            boxShadow: "0 4px 12px rgba(79,70,229,0.25)"
                        }}
                    >
                        + Create Room
                    </button>

                </Link>

            </div>

            {/* Rooms Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                    gap: "24px"
                }}
            >

                {
                    ChatRoomsData.map((room) => (

                        <RoomOuterCard
                            key={room.id}
                            roomId={room.id}
                            title={room.room_name}
                            total={room.total_members}
                            type={room.room_type}
                            image={room.room_image}
                            owner={room.owner}
                            description={room.description}
                                members={room.members}
                        />

                    ))
                }

            </div>

        </div>
    );
};

export default ChatRooms;