import React, { useState, useEffect, useRef } from "react";
import { db, serverTimestamp, addDoc, collection } from "./firebase"; // Firestore config
import MessageComponent from "./MessageComponent"; // Displaying individual messages
import { query, orderBy, onSnapshot } from "firebase/firestore";

const ChatComponent = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Scroll to the bottom of the chat after each message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message to Firestore
  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: messageText,
      createdAt: serverTimestamp(),
      user: user.displayName,
      userId: user.uid,
    });

    setMessageText(""); // Clear input field
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
