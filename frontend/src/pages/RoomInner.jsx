import { useParams } from "react-router-dom";

const RoomInner = () => {

    const { roomId } = useParams();

    // console.log(roomId);

    return (

        <div>

            Room ID: {roomId}

        </div>
    );
};

export default RoomInner;