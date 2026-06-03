import { useEffect, useState } from "react";
import apiFetch from "../common/apiFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// useNavigate
const EditProfile = () => {
    const navigate_ = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        city: "",
        bio: "",
        profile_photo: null
    });
    const [errors, setErrors] = useState({});

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

            if (response.ok) {

                setFormData({
                    username: result.username || "",
                    email: result.email || "",
                    phone: result.phone || "",
                    city: result.city || "",
                    bio: result.bio || "",
                    profile_photo: null
                });
            }

        } catch (error) {

            const errorData = await response.json();

            setErrors(errorData);

            toast.error(
                "Please fix the errors"
            );
        }
    };

    useEffect(() => {

        loadProfile();

    }, []);

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        if (name === "profile_photo") {

            setFormData({
                ...formData,
                profile_photo: files[0]
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = new FormData();

            data.append(
                "username",
                formData.username
            );

            data.append(
                "email",
                formData.email
            );

            data.append(
                "phone",
                formData.phone
            );

            data.append(
                "city",
                formData.city
            );

            data.append(
                "bio",
                formData.bio
            );

            if (formData.profile_photo) {

                data.append(
                    "profile_photo",
                    formData.profile_photo
                );
            }

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/user/profile/`,
                {
                    method: "PUT",

                    credentials: "include",

                    body: data
                }
            );

            if (response.ok) {

                setErrors({});

                toast.success(
                    "Profile updated successfully"
                );
                navigate_('/profile');

            } else {

                const errorData = await response.json();

                setErrors(errorData);

                toast.error(
                    "Please fix the errors"
                );
            }

        } catch (error) {

            toast.error(error.message);
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#eef2ff",
                padding: "clamp(12px,4vw,40px)"
            }}
        >

            <div
                style={{
                    maxWidth: "700px",
                    margin: "auto",
                    background: "white",
                    padding: "clamp(12px,4vw,40px)",
                    borderRadius: "24px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)"
                }}
            >

                <h1
                    style={{
                        marginTop: 0,
                        marginBottom: "30px",
                        color: "#111827"
                    }}
                >
                    Edit Profile
                </h1>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        boxSizing: "border-box"
                    }}
                >

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {
                        errors.username && (

                            <p
                                style={{
                                    color: "red",
                                    margin: 0,
                                    fontSize: "13px"
                                }}
                            >
                                {errors.username[0]}
                            </p>
                        )
                    }
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {
                        errors.email && (

                            <p
                                style={{
                                    color: "red",
                                    margin: 0,
                                    fontSize: "13px"
                                }}
                            >
                                {errors.email[0]}
                            </p>
                        )
                    }
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {
                        errors.phone && (

                            <p
                                style={{
                                    color: "red",
                                    margin: 0,
                                    fontSize: "13px"
                                }}
                            >
                                {errors.phone[0]}
                            </p>
                        )
                    }
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    {
                        errors.city && (

                            <p
                                style={{
                                    color: "red",
                                    margin: 0,
                                    fontSize: "13px"
                                }}
                            >
                                {errors.city[0]}
                            </p>
                        )
                    }
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            height: "120px",
                            resize: "none"
                        }}
                    />
                    {
                        errors.bio && (

                            <p
                                style={{
                                    color: "red",
                                    margin: 0,
                                    fontSize: "13px"
                                }}
                            >
                                {errors.bio[0]}
                            </p>
                        )
                    }
                    {
                        formData.profile_photo && (

                            <img
                                src={
                                    URL.createObjectURL(
                                        formData.profile_photo
                                    )
                                }

                                alt="preview"

                                style={{
                                    // width: "120px",
                                    // height: "120px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginBottom: "10px",
                                    width: "min(120px,30vw)",
                                    height: "min(120px,30vw)"
                                }}
                            />
                        )
                    }
                    <label
                        style={{
                            fontWeight: "600"
                        }}
                    >
                        Profile Photo
                    </label>

                    <input
                        type="file"
                        name="profile_photo"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "14px",
                            border: "none",
                            borderRadius: "14px",
                            background: "#4f46e5",
                            color: "white",
                            fontWeight: "700",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        Save Changes
                    </button>

                </form>

            </div>

        </div>
    );
};

const inputStyle = {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none"
};

export default EditProfile;