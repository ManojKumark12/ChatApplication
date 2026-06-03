import React, { useState } from "react";
import apiFetch from "../common/apiFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import handleResponseError from "../common/handleError";
// import { navigateTo } from "../common/helper_functions";
// useNavigate
const ChatRoomTemplate = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        room_name: "",
        description: "",
        room_type: "public",
        room_image: null
    });

    const [errors, setErrors] = useState({});

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
            room_image: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = new FormData();

            data.append("room_name", formData.room_name);
            data.append("description", formData.description);
            data.append("room_type", formData.room_type);

            if (formData.room_image) {
                data.append("room_image", formData.room_image);
            }

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/chatrooms/create/`,
                {
                    method: "POST",
                    credentials: "include",
                    body: data
                }
            );

            const responseData = await response.json();

            if (!response.ok) {

                setErrors(responseData);

                handleResponseError(response);
            }
            else {

                setErrors({});

                toast.success("Room created successfully!");
                navigate('/')

                // console.log(responseData);
            }

        } catch (error) {

            toast.error(error.message);
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f4f6f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "clamp(12px,4vw,30px)"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "550px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "clamp(16px,4vw,30px)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                }}
            >

                <h2
                    style={{
                        marginBottom: "20px",
                        fontSize: "clamp(22px,5vw,32px)"
                    }}
                >
                    Create Chat Room
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Room Name */}
                    <div style={{ marginBottom: "18px" }}>

                        <label
                            style={labelStyle}
                        >
                            Room Name
                        </label>

                        <input
                            type="text"
                            name="room_name"
                            placeholder="Enter room name"
                            value={formData.room_name}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        {
                            errors.room_name &&
                            <p style={errorStyle}>
                                {errors.room_name[0]}
                            </p>
                        }

                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "18px" }}>

                        <label
                            style={labelStyle}
                        >
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                resize: "none"
                            }}
                        />

                        {
                            errors.description &&
                            <p style={errorStyle}>
                                {errors.description[0]}
                            </p>
                        }

                    </div>

                    {/* Image */}
                    <div style={{ marginBottom: "18px" }}>

                        <label
                            style={labelStyle}
                        >
                            Room Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {
                            errors.room_image &&
                            <p style={errorStyle}>
                                {errors.room_image[0]}
                            </p>
                        }

                    </div>

                    {/* Room Type */}
                    <div style={{ marginBottom: "25px" }}>

                        <label
                            style={labelStyle}
                        >
                            Room Type
                        </label>

                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                marginTop: "8px"
                            }}
                        >

                            <label>

                                <input
                                    type="radio"
                                    name="room_type"
                                    value="public"
                                    checked={formData.room_type === "public"}
                                    onChange={handleChange}
                                />

                                {" "}Public

                            </label>

                            <label>

                                <input
                                    type="radio"
                                    name="room_type"
                                    value="private"
                                    checked={formData.room_type === "private"}
                                    onChange={handleChange}
                                />

                                {" "}Private

                            </label>

                        </div>

                        {
                            errors.room_type &&
                            <p style={errorStyle}>
                                {errors.room_type[0]}
                            </p>
                        }

                    </div>

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
    marginTop: "6px",
    fontSize: "14px",
    boxSizing: "border-box"
};

const labelStyle = {
    display: "block",
    fontWeight: "600"
};

const errorStyle = {
    color: "red",
    fontSize: "13px",
    marginTop: "5px"
};

export default ChatRoomTemplate;