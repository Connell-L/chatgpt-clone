import "./App.css";
import "./normal.css";

import React, { useEffect, useState } from "react";

function App() {
  // run once when app loads
  useEffect(() => {
    getEngines();
  }, []);

  // Initialize the chatLog state as an empty array
  const [input, setInput] = useState("");
  const [models, setModels] = useState(null);
  const [currentModel, setCurrentModel] = useState("");
  const [chatLog, setChatLog] = useState([]);

  // clear the chatLog
  const clearChat = () => {
    setChatLog([]);
  };

  // fetch models
  const getEngines = () => {
    fetch("http://localhost:8080/models")
      .then((res) => res.json())
      .then((data) => {
        setModels(data.models);
        setCurrentModel(data.models[0].id);
      });
  };

  // Function to handle input submission
  async function handleSubmit(e) {
    e.preventDefault();
    // Add the input to the chatLog state
    await setChatLog([...chatLog, { user: "me", message: `${input}` }]);
    // send the message to the API
    const response = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        currentModel,
      }),
    });

    const data = await response.json();
    await setChatLog([
      ...chatLog,
      { user: "me", message: `${input}` },
      { user: "chatgpt", message: `${data.message}` },
    ]);
    //clear input
    await setInput("");
  }

  return (
    <div className="App">
      <aside className="side-menu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>

        <div className="models">
          <select
            onChange={(e) => {
              setCurrentModel(e.target.value);
            }}
            value={currentModel}
          >
            {models !== null && (
              <>
                {models.map((model, index) => (
                  <option key={index} value={model.id}>
                    {model.id}
                  </option>
                ))}
              </>
            )}
          </select>
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
    <div
      className={`chat-message ${
        message.user === "chatgpt" ? "chatgpt" : "me"
      }`}
    >
      <div className="chat-message-center">
        <div
          className={`avatar ${message.user === "chatgpt" ? "chatgpt" : "me"}`}
        ></div>
        <div className="message">
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
