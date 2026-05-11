import React, { useState } from "react";

const ChatRoomTemplate = () => {

    const [formData, setFormData] = useState({
        roomName: "",
        title: "",
        description: "",
        roomType: "public",
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);

        // API call later
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f4f6f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "30px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "550px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "30px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }}
            >

                <h2
                    style={{
                        marginBottom: "10px",
                        color: "#333"
                    }}
                >
                    Create Chat Room
                </h2>

                <p
                    style={{
                        marginBottom: "25px",
                        color: "#777"
                    }}
                >
                    Create a new room and start chatting
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Room Name */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600"
                            }}
                        >
                            Room Name
                        </label>

                        <input
                            type="text"
                            name="roomName"
                            placeholder="Enter room name"
                            value={formData.roomName}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Title */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600"
                            }}
                        >
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            placeholder="Short room title"
                            value={formData.title}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600"
                            }}
                        >
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Describe your room..."
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                resize: "none"
                            }}
                        />
                    </div>

                    {/* Room Image */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600"
                            }}
                        >
                            Room Profile Picture
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Room Type */}
                    <div style={{ marginBottom: "25px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "10px",
                                fontWeight: "600"
                            }}
                        >
                            Room Type
                        </label>

                        <div
                            style={{
                                display: "flex",
                                gap: "20px"
                            }}
                        >

                            <label>
                                <input
                                    type="radio"
                                    name="roomType"
                                    value="public"
                                    checked={formData.roomType === "public"}
                                    onChange={handleChange}
                                />
                                {" "}Public
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="roomType"
                                    value="private"
                                    checked={formData.roomType === "private"}
                                    onChange={handleChange}
                                />
                                {" "}Private
                            </label>

                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Create Room
                    </button>

                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box"
};

export default ChatRoomTemplate;