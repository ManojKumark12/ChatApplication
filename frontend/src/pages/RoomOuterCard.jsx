import { useNavigate } from "react-router-dom";
import { navigateTo } from "../common/helper_functions";

export const RoomOuterCard = ({
    roomId,
    title,
    total,
    type,
    image,
    owner,
    description
}) => {

    const navigate = useNavigate();

    return (

        <div
            onClick={() => {
                navigateTo(navigate, `/room-inner/${roomId}`);
            }}
            style={{
                background: "white",
                borderRadius: "18px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.25s",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
            }}
            className="room-card"
        >

            <img
               src={
    image
        ? image.startsWith("http")
            ? image
            : `${image}`
        : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
}
                alt={title}
                style={{
                    width: "100%",
                    height: "190px",
                    objectFit: "cover"
                }}
            />

            <div
                style={{
                    padding: "18px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px"
                    }}
                >

                    <h3
                        style={{
                            margin: 0,
                            color: "#222",
                            fontSize: "20px"
                        }}
                    >
                        {title}
                    </h3>

                    <span
                        style={{
                            background:
                                type === "public"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                            color:
                                type === "public"
                                    ? "#166534"
                                    : "#991b1b",
                            padding: "5px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600"
                        }}
                    >
                        {type}
                    </span>

                </div>

                <p
                    style={{
                        color: "#666",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        minHeight: "42px"
                    }}
                >
                    {description || "No description available"}
                </p>
                <div
                    style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#555"
                    }}
                >
                    Created by: <strong>{owner}</strong>
                </div>
                <div
                    style={{
                        marginTop: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <div
                        style={{
                            fontWeight: "600",
                            color: "#333"
                        }}
                    >
                        👥 {total} Members
                    </div>

                    {/* <div
                        style={{
                            color: "#4f46e5",
                            fontWeight: "600"
                        }}
                    >
                        Join →
                    </div> */}

                </div>

            </div>

        </div>
    );
};