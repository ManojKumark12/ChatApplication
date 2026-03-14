const RoomInner = () => {
    return (
        <div className="room-container">
            {/* Header */}
            <div className="room-header">
                <div className="room-info">
                    <span className="back-arrow">←</span>
                    <h3>PUBG GAMERS</h3>
                    <span className="online-indicator">10 Online</span>
                </div>
            </div>

            {/* Message Area */}
            <div className="room-messages">
                <div className="message incoming">
                    <span className="sender">ProPlayer99</span>
                    <div className="bubble">Anyone down for a match? 🎮</div>
                </div>

                <div className="message outgoing">
                    <div className="bubble">I'm in! Let's go.</div>
                </div>

                <div className="message incoming">
                    <span className="sender">LootMaster</span>
                    <div className="bubble">Wait for me, just starting my PC.</div>
                </div>
            </div>

            {/* Input Area */}
            <div className="message-input-area">
                <input type="text" placeholder="Write a message..." className="chat-input" />
                <button className="send-btn">Send</button>
            </div>
        </div>
    );
};

export default RoomInner;