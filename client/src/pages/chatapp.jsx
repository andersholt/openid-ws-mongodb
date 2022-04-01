import React, { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../components/loginProvider";

function ChatMessage({ chat: { author, message } }) {
  return (
    <div>
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
      const { author, message } = JSON.parse(event.data);
      setChatLog((oldState) => [...oldState, { author, message }]);
    };
    setWs(ws);
  }, []);

  const userName = useContext(ProfileContext).userinfo.name;

  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");

  function handleNewMessage(event) {
    event.preventDefault();

    const chatMessage = { author: userName, message };
    ws.send(JSON.stringify(chatMessage));
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
