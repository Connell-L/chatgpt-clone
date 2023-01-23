import './App.css';
import './normal.css';

import React, { useState } from 'react';

function App() {
  // Initialize the chatLog state as an empty array
  const [chatLog, setChatLog] = useState([]);
  const [input, setInput] = useState("");

  // Function to handle input submission
  async function handleSubmit(e) {
    e.preventDefault();
    // Add the input to the chatLog state
    setChatLog([...chatLog, { user: "me", message: `${input}` }]);
    // send the message to the API
    const response = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: input
      })
    });

    const data = await response.json();
    setChatLog([...chatLog, { user: "me", message: `${input}` }, {user: 'chatgpt', message: `${data.message}`}]);
    //clear input 
    setInput("");
  }

  return (
    <div className="App">
      <aside className="side-menu">
        <div className="side-menu-button">
          <span>+</span>
          New Chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              className="chat-input-text-area"
              placeholder="Type your message here"
              onChange={(e) => setInput(e.target.value)}
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "chatgpt" ? "chatgpt" : "me"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "chatgpt" ? "chatgpt" : "me"}`}>
          </div>
          <div className="message">

          <p>{message.message}</p>
        </div>
      </div>
    </div>
  );
}


export default App;