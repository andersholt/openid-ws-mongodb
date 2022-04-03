import React, { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../components/loginProvider";
import "./chatapp.css";
import { Login } from "./login";
let lastTimestamp;
function ChatMessage({ chat: { author, message, timestamp } }) {
  let humanDateFormat = undefined;
  if (lastTimestamp + 300 > timestamp || lastTimestamp === undefined) {
    const dateObject = new Date(timestamp);
    humanDateFormat = dateObject.toLocaleString();
  }
  lastTimestamp = timestamp;

  const { userinfo } = useContext(ProfileContext);

  if (userinfo.name === author) {
    console.log("you");
    return (
      <div
        id="chatmessage"
        style={{
          marginLeft: "auto",
          marginRight: "0px",
        }}
      >
        {humanDateFormat && <p>{humanDateFormat}: </p>}
        <div id="authorMessage" style={{ backgroundColor: "teal" }}>
          <strong style={{ color: "#fefefefe" }}>{author}: </strong>
          <p>{message}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        id="chatmessage"
        style={{
          marginLeft: "0px",
          marginRight: "auto",
        }}
      >
        {humanDateFormat && <p>{humanDateFormat}: </p>}
        <div
          id="authorMessage"
          style={{ backgroundColor: "#FFD124", color: "black" }}
        >
          <strong>{author}: </strong>
          <p>{message}</p>
        </div>
      </div>
    );
  }
}

export function ChatApplication() {
  const [ws, setWs] = useState();
  const { userinfo } = useContext(ProfileContext);

  useEffect(() => {
    const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
    ws.onmessage = (event) => {
      const { author, message, timestamp } = JSON.parse(event.data);
      setChatLog((oldState) => [...oldState, { author, message, timestamp }]);
    };

    ws.onclose = () => {
      setTimeout(() => connect(), 1000);
    };

    getChat();
    setWs(ws);
  }, []);
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");

  if (!userinfo) {
    return <Login />;
  }

  const userName = useContext(ProfileContext).userinfo.name;

  async function getChat() {
    try {
      const res = await fetch("/api/chat");
      const result = await res.json();
      setChatLog(result);
    } catch (e) {
      console.log.error;
    }
  }

  async function handleNewMessage(event) {
    event.preventDefault();

    const chatMessage = {
      author: userName,
      message,
      timestamp: Date.now(),
    };
    ws.send(JSON.stringify(chatMessage));
    await fetch("/api/chat", {
      method: "post",
      body: new URLSearchParams({
        author: chatMessage.author,
        message: chatMessage.message,
        timestamp: chatMessage.timestamp,
      }),
    });
    setMessage("");
  }

  return (
    <div>
      <div id="chat">
        <div id={"header"}>
          <h1>MyOpenChat</h1>
        </div>
        <main>
          {chatLog.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </main>
      </div>
      <footer>
        <form onSubmit={handleNewMessage}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button>Submit</button>
        </form>
      </footer>
    </div>
  );
}
