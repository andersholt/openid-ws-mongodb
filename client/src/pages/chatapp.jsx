import React, { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../components/loginProvider";
import { fetchJSON } from "../hooks/global";

function ChatMessage({ chat: { author, message, timestamp } }) {
  const dateObject = new Date(timestamp);

  const humanDateFormat = dateObject.toLocaleString();

  return (
    <div>
      <>{humanDateFormat}: </>
      <strong>{author}: </strong>
      {message}
    </div>
  );
}

export function ChatApplication() {
  const [ws, setWs] = useState();

  useEffect(() => {
    const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
    ws.onmessage = (event) => {
      const { author, message, timestamp } = JSON.parse(event.data);
      setChatLog((oldState) => [...oldState, { author, message, timestamp }]);
    };
    getChat();
    setWs(ws);
  }, []);
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");

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
    <>
      <h1>MyOpenChat</h1>
      <main>
        {chatLog.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </main>
      <footer>
        <form onSubmit={handleNewMessage}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button>Submit</button>
        </form>
      </footer>
    </>
  );
}
