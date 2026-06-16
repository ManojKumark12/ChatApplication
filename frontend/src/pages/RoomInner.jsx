import { useParams } from "react-router-dom";
import apiFetch from "../common/apiFetch";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react"; import { useSelector } from "react-redux";
import handleResponseError from "../common/handleError";
const RoomInner = () => {
    const [socket, setSocket] = useState(null);
    const { roomId } = useParams();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [joined, setJoined] = useState(false);
    const [isMobile, setIsMobile] =
        useState(window.innerWidth < 768);

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(
                window.innerWidth < 768
            );
        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () =>
            window.removeEventListener(
                "resize",
                handleResize
            );

    }, []); const [roomData, setRoomData] = useState(null);

    const [showMembers, setShowMembers] = useState(false);
    const [messages, setMessages] = useState([]);
    const { user } = useSelector(
        (state) => state.user
    );
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef(null);
    const loadRoom = async () => {

        try {

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/chatrooms/rooms/${roomId}/`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const result = await response.json();
            // console.log(result);
            setRoomData(result);

            setJoined(result.is_member);
            if (!response.ok) {
                toast.error("Please Login");
            }

        } catch (error) {

            console.log(error);
        }
    };

    const loadMessages = async () => {

        try {

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/messages/room/${roomId}/`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            let result = {};

            try {

                result = await response.json();

            } catch {

                result = {};
            }

            if (response.ok) {

                setMessages(result);

            } else {
                // toast.error(
                //     result.error ||
                //     result.detail ||
                //     "Something went wrong"
                // );
            }

        } catch (error) {

            toast.error(error.message);
        }
    };
    useEffect(() => {

        loadRoom();
        loadMessages();

    }, []);
    const joinRoom = async () => {

        try {

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/chatrooms/join-room/${roomId}/`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (response.ok) {

                toast.success(result.message);

                setJoined(result.join);

                loadRoom();

            } else {

                handleResponseError(response)
            }

        } catch (error) {

            toast.error(error.message);
        }
    };
    useEffect(() => {

        if (joined) {

            loadMessages();

        } else {

            setMessages([]);
        }

    }, [joined]);
    const sendMessage = async () => {

        // if (!messageInput.trim()) {

        //     return;
        // }

        if (!messageInput.trim()) {

            return;
        }

        socket.send(

            JSON.stringify({

                message: messageInput,

                sender_id: user.id
            })
        );

        setMessageInput("");
    };

    // try {


    //     const response = await apiFetch(
    //         `${import.meta.env.VITE_API_URL}/messages/send/${roomId}/`,
    //         {
    //             method: "POST",

    //             credentials: "include",

    //             headers: {
    //                 "Content-Type": "application/json"
    //             },

    //             body: JSON.stringify({
    //                 content: messageInput
    //             })
    //         }
    //     );

    //     const result = await response.json();

    //     if (response.ok) {

    //         setMessages((prev) => [
    //             ...prev,
    //             result
    //         ]);

    //         setMessageInput("");

    //     } else {

    //         handleResponseError(response)
    //     }

    // } catch (error) {

    //     toast.error(error.message);
    // }
    useEffect(() => {

        if (!joined) return;

        const backendUrl =
            import.meta.env.VITE_API_URL;

        const wsUrl =
            backendUrl
                .replace("https://", "wss://")
                .replace("http://", "ws://");

        const ws = new WebSocket(

            `${wsUrl}/ws/chat/${roomId}/`
        );

        ws.onopen = () => {

            console.log(
                "WebSocket Connected"
            );
        };

        ws.onmessage = (event) => {

            const data = JSON.parse(event.data);

            if (data.event === "users_status") {

                setOnlineUsers(data.online_users);

            } else if (data.event === "status_update") {

                if (data.status === "online") {

                    setOnlineUsers(prev => [

                        ...new Set([
                            ...prev,
                            data.user_id
                        ])
                    ]);

                } else {

                    setOnlineUsers(prev =>

                        prev.filter(
                            id => id !== data.user_id
                        )
                    );
                }

            } else {

                setMessages(prev => [
                    ...prev,
                    data
                ]);
            }
        };
        ws.onclose = () => {

            console.log(
                "WebSocket Closed"
            );
        };

        setSocket(ws);

        return () => {

            ws.close();
        };

    }, [roomId, joined]);
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView();

    }, [messages]);
    return (

        <div
            style={{
                height: "100dvh",
                overflow: "hidden", display: "flex",
                flexDirection: isMobile ? "column" : "row",
                background: "#f4f7fb"
            }}
        >

            {/* LEFT ROOM INFO */}
            {isMobile ? (
                <div
                    style={{
                        background: "white",
                        padding: "10px 15px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontWeight: "700",
                                fontSize: "16px"
                            }}
                        >
                            {roomData?.room_name}
                        </div>

                        <div
                            style={{
                                fontSize: "12px",
                                color: "#666"
                            }}
                        >
                            👥 {roomData?.total_members}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "8px"
                        }}
                    >
                        <button
                            onClick={joinRoom}
                            style={{
                                padding: "8px 12px",
                                border: "none",
                                borderRadius: "8px",
                                background:
                                    joined
                                        ? "#dc2626"
                                        : "#4f46e5",
                                color: "white"
                            }}
                        >
                            {joined ? "Leave" : "Join"}
                        </button>

                        <button
                            onClick={() =>
                                setShowMembers(!showMembers)
                            }
                            style={{
                                padding: "8px 12px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#111827",
                                color: "white"
                            }}
                        >
                            Members
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        width: "320px", padding: "25px"
                    }}
                >

                    <div
                        style={{
                            background: "white",
                            padding: "30px",
                            borderRadius: "18px",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.08)"
                        }}
                    >

                        <h1
                            style={{
                                marginBottom: "10px",
                                color: "#222",
                                fontSize: "28px"
                            }}
                        >
                            {roomData?.room_name}
                        </h1>

                        <p
                            style={{
                                color: "#666",
                                lineHeight: "1.6"
                            }}
                        >
                            {roomData?.description}
                        </p>

                        <div
                            style={{
                                marginTop: "14px",
                                color: "#555",
                                fontWeight: "600"
                            }}
                        >
                            Owner: {roomData?.owner}
                        </div>

                        <div
                            style={{
                                marginTop: "8px",
                                color: "#555"
                            }}
                        >
                            👥 {roomData?.total_members} Members
                        </div>

                        {/* Join / Leave */}
                        <button
                            onClick={joinRoom}
                            style={{
                                marginTop: "24px",
                                padding: "12px 22px",
                                background:
                                    joined
                                        ? "#dc2626"
                                        : "#4f46e5",

                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "15px",
                                width: "100%"
                            }}
                        >
                            {
                                joined
                                    ? "Leave Room"
                                    : "Join Room"
                            }
                        </button>

                        {/* Toggle Members */}
                        <button
                            onClick={() => {
                                setShowMembers(!showMembers);
                            }}
                            style={{
                                marginTop: "14px",
                                padding: "10px 18px",
                                background: "#111827",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "14px",
                                width: "100%"
                            }}
                        >
                            {
                                showMembers
                                    ? "Hide Members"
                                    : "Show Members"
                            }
                        </button>

                    </div>

                </div>)}


            {/* CENTER CHAT AREA */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "25px",
                    minHeight: 0,
                    overflow: "hidden"
                }}
            >

                {/* Chat Header */}
                <div
                    style={{
                        background: "white",
                        padding: "18px 24px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                        marginBottom: "20px",
                        fontWeight: "700",
                        fontSize: "20px",
                        color: "#222"
                    }}
                >
                    💬 General Chat
                </div>

                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        background: "white",
                        borderRadius: isMobile ? "0" : "18px",
                        padding: isMobile ? "12px" : "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px"
                    }}
                >

                    {/* Fake Messages */}

                    {
                        messages.map((message) => {

                            const isCurrentUser =
                                message.sender === user?.id;

                            return (

                                <div
                                    key={message.id}

                                    style={{
                                        display: "flex",

                                        justifyContent:
                                            isCurrentUser
                                                ? "flex-end"
                                                : "flex-start"
                                    }}
                                >

                                    <div
                                        style={{
                                            background:
                                                isCurrentUser
                                                    ? "#dcfce7"
                                                    : "#eef2ff",

                                            padding: "14px",

                                            borderRadius: "14px",

                                            maxWidth: isMobile ? "85%" : "60%",
                                            minWidth: "120px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                marginBottom: "8px"
                                            }}
                                        >

                                            {
                                                message.sender_photo ? (

                                                    <img
                                                        src={
                                                            message?.sender_photo
                                                                ? `${message.sender_photo}`
                                                                : "https://via.placeholder.com/160"
                                                        }

                                                        alt={message.sender_name}

                                                        style={{
                                                            width: "34px",
                                                            height: "34px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover"
                                                        }}
                                                    />

                                                ) : (

                                                    <div
                                                        style={{
                                                            width: "34px",
                                                            height: "34px",
                                                            borderRadius: "50%",
                                                            background: "#4f46e5",
                                                            color: "white",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            fontSize: "13px",
                                                            fontWeight: "700"
                                                        }}
                                                    >
                                                        {
                                                            message.sender_name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()
                                                        }
                                                    </div>

                                                )
                                            }

                                            <div
                                                style={{
                                                    fontWeight: "700"
                                                }}
                                            >
                                                {message.sender_name}
                                            </div>

                                        </div>

                                        <div
                                            style={{
                                                color: "#222",
                                                lineHeight: "1.5"
                                            }}
                                        >
                                            {message.content}
                                        </div>

                                    </div>

                                </div>
                            );
                        })
                    }
                    <div ref={messagesEndRef}></div>
                </div>

                {/* Input Area */}
                <div
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="text"

                        value={messageInput}

                        onChange={(e) => {
                            setMessageInput(e.target.value);
                        }}

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                sendMessage();
                            }
                        }}

                        placeholder="Type a message..."

                        style={{
                            flex: 1,
                            padding: "14px",
                            borderRadius: "12px",
                            border: "1px solid #d1d5db",
                            outline: "none",
                            fontSize: "15px"
                        }}
                    />
                    <button
                        onClick={sendMessage}

                        style={{
                            padding: "14px 22px",
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: "600",
                            width: isMobile ? "100%" : "auto"
                        }}
                    >
                        Send
                    </button>

                </div>

            </div>
            {
                isMobile && showMembers && (

                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            width: "85%",
                            height: "100dvh",
                            background: "white",
                            zIndex: 9999,
                            overflowY: "auto",
                            boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
                            padding: "20px"
                        }}
                    >

                        <button
                            onClick={() => setShowMembers(false)}
                            style={{
                                border: "none",
                                background: "#dc2626",
                                color: "white",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                marginBottom: "20px"
                            }}
                        >
                            Close
                        </button>

                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom: "20px"
                            }}
                        >
                            Members
                        </h2>

                        {
                            roomData?.members?.map((member) => (

                                <div
                                    key={member.id}
                                    style={{
                                        padding: "12px",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "12px",
                                        marginBottom: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px"
                                    }}
                                >

                                    {
                                        member.profile_photo ? (

                                            <img
                                                src={member.profile_photo}
                                                alt={member.username}
                                                style={{
                                                    width: "45px",
                                                    height: "45px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    width: "45px",
                                                    height: "45px",
                                                    borderRadius: "50%",
                                                    background: "#4f46e5",
                                                    color: "white",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontWeight: "700"
                                                }}
                                            >
                                                {member.username?.[0]?.toUpperCase()}
                                            </div>

                                        )
                                    }

                                    <div>
                                        <div
                                            style={{
                                                fontWeight: "700"
                                            }}
                                        >
                                            {member.username}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#666"
                                            }}
                                        >
                                            {member.email}
                                        </div>
                                    </div>

                                </div>

                            ))
                        }

                    </div>

                )
            }

            {/* RIGHT MEMBERS SIDEBAR */}
            {
                !isMobile && (
                    <div
                        style={{
                            width:
                                showMembers
                                    ? "320px"
                                    : "0px",
                            background: "white",
                            height: "100dvh",
                            overflow: "hidden",
                            transition: "0.3s",
                            boxShadow:
                                showMembers
                                    ? "-4px 0 12px rgba(0,0,0,0.08)"
                                    : "none"
                        }}
                    >

                        {
                            showMembers && (

                                <div
                                    style={{
                                        padding: "24px",
                                        height: "100%",
                                        overflowY: "auto"
                                    }}
                                >

                                    <h2
                                        style={{
                                            marginTop: 0,
                                            marginBottom: "20px",
                                            color: "#222"
                                        }}
                                    >
                                        Members
                                    </h2>
                                    {
                                        roomData?.members?.map((member) => (

                                            <div
                                                key={member.id}
                                                style={{
                                                    padding: "12px 14px",
                                                    borderRadius: "14px",
                                                    background: "#f8fafc",
                                                    marginBottom: "12px",
                                                    border: "1px solid #e5e7eb",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                    width: "100%",
                                                    boxSizing: "border-box"
                                                }}
                                            >

                                                {/* Profile Image */}
                                                {
                                                    member.profile_photo ? (

                                                        <img
                                                            src={`${member.profile_photo}`}

                                                            alt={member.username}

                                                            style={{
                                                                width: "48px",
                                                                height: "48px",
                                                                borderRadius: "50%",
                                                                objectFit: "cover",
                                                                flexShrink: 0
                                                            }}
                                                        />

                                                    ) : (

                                                        <div
                                                            style={{
                                                                width: "48px",
                                                                height: "48px",
                                                                borderRadius: "50%",
                                                                background: "#4f46e5",
                                                                color: "white",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                fontWeight: "700",
                                                                fontSize: "17px",
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            {
                                                                member.username
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()
                                                            }
                                                        </div>

                                                    )
                                                }

                                                {/* Text */}
                                                <div
                                                    style={{
                                                        overflow: "hidden"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            fontWeight: "700",
                                                            color: "#222",
                                                            fontSize: "15px",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis"
                                                        }}
                                                    >
                                                        {/* {console.log(member.id)} */}
                                                        {member.username}
                                                        {
                                                            onlineUsers.includes(
                                                                member.id
                                                            )

                                                                ? " 🟢"

                                                                : " ⚫"
                                                        }
                                                    </div>

                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#666",
                                                            marginTop: "3px",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis"
                                                        }}
                                                    >
                                                        {member.email}
                                                    </div>

                                                </div>

                                            </div>

                                        ))
                                    }

                                </div>

                            )
                        }

                    </div>)
            }

        </div>
    );
};

export default RoomInner;