import React, { useContext, useState } from "react";
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
