import React from "react";
import { Avatar } from "@mui/material"; // Import Avatar

function MessageComponent({ message, user }) {
  // Destructure message and user
  if (!message || !user) return null; // Check if message and user are available

  return (
    <div
      className={`message ${
        message.userId === user.uid ? "own-message" : "other-message"
      }`}
    >
      {message.user ? (
        <Avatar className="message-avatar">{message.user[0]}</Avatar>
      ) : (
        <Avatar className="message-avatar">?</Avatar> // Fallback in case userName is missing
      )}
      <div className="message-content">
        <div className="message-header">
          <span className="message-username">
            {message.user || "Unknown User"}
          </span>
          <span className="message-timestamp">
            {message.createdAt
              ? message.createdAt.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No timestamp"}
          </span>
        </div>
        <p className="message-text">{message.text || "No message content"}</p>
      </div>
    </div>
  );
}

export default MessageComponent;
