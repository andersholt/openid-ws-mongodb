import React, { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../hooks/loginHook";

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
    const ws = new WebSocket("ws://localhost:3000");
    ws.onmessage = (event) => {
      console.log(event.data);
    };
    setWs(ws);
  }, []);

  const user = useContext(ProfileContext).userinfo.name;

  const [chatLog, setChatLog] = useState([
    { author: "Anders", message: "Hello" },
    { author: "Anders", message: "Hello" },
    { author: "Anders", message: "Hello" },
  ]);

  const [message, setMessage] = useState();

  function handleNewMessage(event) {
    event.preventDefault();
    setChatLog([...chatLog, { author: user, message }]);
  }

  return (
    <>
      <header>Chatapp for {user}</header>
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
