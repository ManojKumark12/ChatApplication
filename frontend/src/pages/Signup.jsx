import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style_css/Auth.css";
import apiFetch from "../common/apiFetch";
import { navigateTo } from "../common/helper_functions";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginfunc } from "../redux/User.slice";
const Signup = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        profile_photo: null
    });

    const handleChange = (e) => {

        if (e.target.name === "profile_photo") {

            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0]
            });

        } else {

            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const submitData = new FormData();

            submitData.append(
                "username",
                formData.username
            );

            submitData.append(
                "email",
                formData.email
            );

            submitData.append(
                "password",
                formData.password
            );

            if (formData.profile_photo) {

                submitData.append(
                    "profile_photo",
                    formData.profile_photo
                );
            }

            const response = await apiFetch(
                `${import.meta.env.VITE_API_URL}/user/signup/`,
                {
                    method: "POST",

                    credentials: "include",

                    body: submitData
                }
            );

            if (!response.ok) {

                const errorData = await response.json();

                setErrors(errorData);

                toast.error("Signup failed");

            } else {

                const res = await response.json();

                toast.success(
                    "Account created successfully!"
                );

                dispatch(loginfunc(res.user));

                navigateTo(navigate, "/");
            }

        } catch (error) {

            toast.error(error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join our community today</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">

                        <label>Profile Photo</label>

                        <input
                            type="file"
                            name="profile_photo"
                            accept="image/*"
                            onChange={handleChange}
                        />

                    </div>
                    
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="John Doe"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <p className="error">{errors.username[0]}</p>}
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="error">{errors.email[0]}</p>}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className="error">{errors.password[0]}</p>}
                    </div>

                    <button type="submit" className="btn-primary">
                        Sign Up
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;