import { useEffect, useState } from "react";
import apiFetch from "../common/apiFetch";
import { RoomOuterCard } from "./RoomOuterCard";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const Profile = () => {

    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("joined");
    const { isloggedin } = useSelector(
        (state) => state.user
    );
    const loadProfile = async () => {

        try {

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/user/profile/`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const result = await response.json();
            // console.log(result);
            setUserData(result);

        } catch (error) {

            toast.error("Unable to load profile");
        }
    };

    useEffect(() => {

        loadProfile();

    }, []);

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#eef2ff",
                padding: "clamp(12px,4vw,30px)"
            }}
        >

            {/* TOP PROFILE SECTION */}
            <div
                style={{
                    maxWidth: "1300px",
                    margin: "auto"
                }}
            >

                <div
                    style={{
                        background: "white",
                        borderRadius: "28px",
                        overflow: "hidden",
                        boxShadow: "0 10px 35px rgba(0,0,0,0.08)"
                    }}
                >

                    {/* Cover */}
                    <div
                        style={{
                            height: "240px",
                            background:
                                "linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea)"
                        }}
                    />

                    {/* Profile Info */}
                    <div
                        style={{
                            padding: "40px",
                            marginTop: "-90px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                flexWrap: "wrap",
                                gap: "20px"
                            }}
                        >

                            {/* LEFT */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "24px",
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                }}
                            >
                                <img
                                    src={
                                        userData?.profile_photo
                                            ? `${userData.profile_photo}`
                                            : "https://via.placeholder.com/160"
                                    }

                                    alt="profile"

                                    style={{
                                        width: "min(160px,35vw)",
                                        height: "min(160px,35vw)",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "6px solid white",
                                        boxShadow:
                                            "0 6px 18px rgba(0,0,0,0.15)"
                                    }}
                                />

                                {/* Details */}
                                <div
                                    style={{
                                        minWidth: 0,
                                        flex: 1
                                    }}
                                >

                                    <h1
                                        style={{
                                            margin: 0,
                                            fontSize: "clamp(24px,6vw,42px)",
                                            color: "#111827",
                                            wordBreak: "break-word"
                                        }}
                                    >
                                        {userData?.username}
                                    </h1>

                                    <p
                                        style={{
                                            color: "#6b7280",
                                            marginTop: "8px",
                                            fontSize: "17px"
                                        }}
                                    >
                                        {userData?.email}
                                    </p>

                                    <div
                                        style={{
                                            marginTop: "16px",
                                            display: "flex",
                                            gap: "14px",
                                            flexWrap: "wrap"
                                        }}
                                    >

                                        <div style={badgeStyle}>
                                            📍 {
                                                userData?.city
                                                || "No City"
                                            }
                                        </div>

                                        <div style={badgeStyle}>
                                            📞 {
                                                userData?.phone
                                                || "No Phone"
                                            }
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* RIGHT STATS */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "18px"
                                }}
                            >
                                {isloggedin &&
                                    <button
                                        onClick={() => {
                                            window.location.href = "/edit-profile";
                                        }}

                                        style={{
                                            padding: "12px 22px",
                                            background: "#111827",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            fontWeight: "700",
                                            fontSize: "15px"
                                        }}
                                    >
                                        Edit Profile
                                    </button>
                                }
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div style={statsCardStyle}>

                                    <div style={statsNumberStyle}>
                                        {
                                            userData?.joined_rooms
                                                ?.length || 0
                                        }
                                    </div>

                                    <div style={statsTextStyle}>
                                        Rooms Joined
                                    </div>

                                </div>

                                <div style={statsCardStyle}>

                                    <div style={statsNumberStyle}>
                                        {
                                            userData?.created_rooms
                                                ?.length || 0
                                        }
                                    </div>

                                    <div style={statsTextStyle}>
                                        Rooms Created
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* BIO */}
                        <div
                            style={{
                                marginTop: "34px",
                                background: "#f8fafc",
                                padding: "24px",
                                borderRadius: "20px",
                                border:
                                    "1px solid #e5e7eb"
                            }}
                        >

                            <div
                                style={{
                                    fontWeight: "700",
                                    color: "#374151",
                                    marginBottom: "12px"
                                }}
                            >
                                About
                            </div>

                            <div
                                style={{
                                    color: "#4b5563",
                                    lineHeight: "1.8"
                                }}
                            >
                                {
                                    userData?.bio
                                    || "No bio available"
                                }
                            </div>

                        </div>

                    </div>

                </div>

                {/* TABS */}
                <div
                    style={{
                        marginTop: "40px",
                        display: "flex",
                        gap: "16px"
                    }}
                >

                    <button
                        onClick={() => {
                            setActiveTab("joined");
                        }}
                        style={{
                            ...tabButtonStyle,
                            background:
                                activeTab === "joined"
                                    ? "#4f46e5"
                                    : "white",

                            color:
                                activeTab === "joined"
                                    ? "white"
                                    : "#111827"
                        }}
                    >
                        Joined Rooms
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("created");
                        }}
                        style={{
                            ...tabButtonStyle,
                            background:
                                activeTab === "created"
                                    ? "#4f46e5"
                                    : "white",

                            color:
                                activeTab === "created"
                                    ? "white"
                                    : "#111827"
                        }}
                    >
                        Created Rooms
                    </button>

                </div>

                {/* ROOMS GRID */}
                <div
                    style={{
                        marginTop: "28px",
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill,minmax(280px,1fr))",
                        gap: "24px"
                    }}
                >

                    {
                        activeTab === "joined"

                            ? userData?.joined_rooms?.map((room) => (

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

                            : userData?.created_rooms?.map((room) => (

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

        </div>
    );
};

const badgeStyle = {
    background: "#eef2ff",
    padding: "10px 16px",
    borderRadius: "14px",
    fontWeight: "600",
    color: "#4338ca",
    fontSize: "14px"
};

const statsCardStyle = {
    background: "white",
    padding: "22px",
    borderRadius: "18px",
    minWidth: "140px", textAlign: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
};

const statsNumberStyle = {
    fontSize: "34px",
    fontWeight: "700",
    color: "#4f46e5"
};

const statsTextStyle = {
    marginTop: "10px",
    color: "#6b7280",
    fontWeight: "600"
};

const tabButtonStyle = {
    padding: "14px 24px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    transition: "0.2s"
};

export default Profile;