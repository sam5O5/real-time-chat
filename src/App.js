import React, { useState, useEffect } from "react";
import { Chat } from "./components/Chat";
import { auth, provider, db } from "./firebase-config.js";
import { Auth } from "./components/Auth.js";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";
import {
  collection, addDoc, where, serverTimestamp, onSnapshot, query, orderBy,
} from "firebase/firestore";
import "./App.css";

const cookies = new Cookies();
const onlineusersRef = collection(db, "onlineusers");


function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);


  useEffect(() => {
    const queryUsers = query(
        onlineusersRef,
        orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryUsers, (snapshot) => {
        let onlineUsers = [];
        snapshot.forEach((doc) => {
            onlineUsers.push({ ...doc.data(), id: doc.id });
        });
        console.log(onlineUsers);
        setOnlineUsers(onlineUsers);
    });

    return () => unsuscribe();
  }, []);

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {!isInChat ? (
        <>
          <div className="room">
            <label> Type room name: </label>
            <input onChange={(e) => setRoom(e.target.value)} />
            <button
              onClick={() => {
                setIsInChat(true);
              }}
            >
              Enter Room
            </button>
          </div>
            <div className="online-users">
              <label>Users Online : </label>
              {onlineUsers.map((onlineuser) => (
                  <div key={onlineuser.id} className="online-user">
                    <span className="user">{onlineuser.user}</span>
                  </div>
              ))}
          </div>
        </>
      ) : (
        <Chat room={room} />
      )}
    </AppWrapper>
  );
}

export default ChatApp;