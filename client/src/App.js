import "./App.css";
import "./normal.css";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

function App() {
  
  const port = process.env.PORT || 8080;

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
  const getEngines = useCallback(() => {
      axios.get(`http://localhost:${port}/models`)
      .then(({ data }) => {
          setModels(data.models);
          setCurrentModel(data.models[0].id);
        });
    }, [port]);
  
  // ...
  
  // Function to handle input submission
  async function handleSubmit(e) {
    e.preventDefault();
    // Add the input to the chatLog state
    await setChatLog([...chatLog, { user: "me", message: `${input}` }]);
    // send the message to the API
    try {
          const { data } = await axios.post(`http://localhost:${port}/`, {
              message: input,
              currentModel,
            });
          await setChatLog([
              ...chatLog,
              { user: "me", message: `${input}` },
              { user: "chatgpt", message: `${data.message}` },
            ]);
          } catch(error) {
          console.log(error);
        }
        //clear input
        await setInput("");
      }
      
  
      useEffect(() => {
          getEngines();
        }, [getEngines]);
      
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
