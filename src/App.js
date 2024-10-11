import React, { useState, useEffect } from "react";
import { Button, TextField, Avatar } from "@mui/material";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        userName: user?.displayName || "Anonymous", // Ensure userName is set or fallback to "Anonymous"
        userId: user?.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  const handleSignIn = () => {
    signInWithPopup(auth, provider).catch((error) => alert(error.message));
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Professional Chat App</h1>
        {user && (
          <div className="user-info">
            <span>{user.displayName}</span>
            <Avatar src={user.photoURL} />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        )}
      </header>

      <div className="chat-container">
        {user ? (
          <div className="chat-main">
            <div className="messages">
              {messages.map(({ id, data }) => (
                <div
                  key={id}
                  className={`message ${
                    data.userId === user.uid ? "own-message" : "other-message"
                  }`}
                >
                  <Avatar className="message-avatar">
                    {data.userName ? data.userName[0] : ""}
                  </Avatar>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-username">
                        {data.userName || "Anonymous"}
                      </span>
                      <span className="message-timestamp">
                        {data.timestamp?.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="message-text">{data.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-form">
              <TextField
                label="Type your message..."
                variant="outlined"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSend}>
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div className="login-container">
            <Button variant="contained" color="primary" onClick={handleSignIn}>
              Sign In with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
