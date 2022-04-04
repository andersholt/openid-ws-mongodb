import React, { useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "../components/loginProvider";
import "./chatapp.css";
import { Login } from "./login";
import { Navbar } from "../components/navbar";
let lastTimestamp = undefined;
let lastAuthor = undefined;
function ChatMessage({ chat: { author, message, timestamp } }) {
  let humanDateFormat = undefined;
  let showName = true;

  if (lastTimestamp + 300000 < timestamp || lastTimestamp === undefined) {
    const dateObject = new Date(timestamp);
    humanDateFormat = dateObject.toLocaleString();
  }
  if (lastAuthor === author) {
    showName = false;
  }

  lastAuthor = author;
  lastTimestamp = timestamp;

  const { userinfo } = useContext(ProfileContext);

  if (userinfo.name === author) {
    return (
      <div
        id="chatmessage"
        style={{
          marginLeft: "auto",
          marginRight: "0px",
          maxWidth: "40vh",
        }}
      >
        {humanDateFormat && (
          <p style={{ fontSize: "small" }}>{humanDateFormat} </p>
        )}
        {showName && <strong style={{ color: "black" }}>{author} </strong>}

        <div
          id="authorMessage"
          style={{
            backgroundColor: "teal",
            marginRight: "0vh",
            marginLeft: "auto",
          }}
        >
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
          maxWidth: "40vh",
        }}
      >
        {humanDateFormat && (
          <p style={{ fontSize: "small" }}>{humanDateFormat}: </p>
        )}
        {showName && <strong style={{ color: "black" }}>{author}: </strong>}

        <div
          id="authorMessage"
          style={{
            backgroundColor: "#E2D1F9",
            color: "black",
            marginRight: "auto",
            marginLeft: "0vh",
          }}
        >
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
    if (message !== "") {
      ws.send(JSON.stringify(chatMessage));
      await fetch("/api/chat", {
        method: "post",
        body: new URLSearchParams({
          author: chatMessage.author,
          message: chatMessage.message,
          timestamp: chatMessage.timestamp,
        }),
      });
    }

    setMessage("");
  }

  return (
    <div>
      <Navbar />
      <div id="chatbox">
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
            <input
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button>Submit</button>
          </form>
        </footer>
      </div>
    </div>
  );
}
