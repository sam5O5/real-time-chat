import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import "../styles/chat.css";

export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

  const messagesRef = collection(db, "messages");
  const onlineUsersRef = collection(db, "onlineusers");

  useEffect(() => {
    const unsubscribeMessages = onSnapshot(
      query(
        messagesRef,
        where("room", "==", room),
        orderBy("createdAt")
      ),
      (snapshot) => {
        let updatedMessages = [];
        snapshot.forEach((doc) => {
          updatedMessages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(updatedMessages);
      }
    );

    const unsubscribeUsers = onSnapshot(
      query(
        onlineUsersRef,
        orderBy("user")
      ),
      (snapshot) => {
        let updatedUsers = [];
        snapshot.forEach((doc) => {
          updatedUsers.push({ ...doc.data(), id: doc.id });
        });
        setUsers(updatedUsers);
      }
    );

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [room]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;

    const messageData = {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    };

    if (selectedUser !== "") {
      messageData.to = selectedUser;
      messageData.isPersonal = true;
    }

    await addDoc(messagesRef, messageData);

    setNewMessage("");
    setSelectedUser("");
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="chat-app">
      <div className="header">
        <h1>Chat Room: {room.toUpperCase()}</h1>
        <h2>
          {selectedUser !== "" ? `Personal chat with ${selectedUser}` : ""}
        </h2>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.isPersonal ? "personal-message" : ""
            }`}
          >
            <span className="user">
              {message.user === auth.currentUser.displayName ? "~You" : message.user}
              :
            </span>{" "}
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Message"
        />
        <select
          value={selectedUser}
          onChange={(event) => handleSelectUser(event.target.value)}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};
