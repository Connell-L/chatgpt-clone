import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Input } from "@mui/material";
import NewChatButton from "./NewChatButton";

const ChatMessage = ({ message }) => {
  return (
    <Box
      data-testid="chat-message-container"
      className={`chat-message ${
        message.user === "chatgpt" ? "chatgpt" : "me"
      }`}
    >
      <Box className="chat-message-center">
        <Box
          data-testid="avatar"
          className={`avatar ${message.user === "chatgpt" ? "chatgpt" : "me"}`}
        ></Box>
        <Box data-testid="chat-message" className="message">
          <p>{message.message}</p>
        </Box>
      </Box>
    </Box>
  );
};

const ChatLog = () => {
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
    axios.get(`http://localhost:${port}/models`).then(({ data }) => {
      setModels(data.models);
      setCurrentModel(data.models[0].id);
    });
  }, [port]);

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
    } catch (error) {
      console.log(error);
    }
    //clear input
    await setInput("");
  }

  useEffect(() => {
    getEngines();
  }, [getEngines]);

  return (
    <>
      <Box
        data-testid="home-page-container"
        sx={{
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          backgroundColor: "#282c34",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <Box
          data-testid="side-drawer"
          sx={{ border: "1px solid red", width: "260px", padding: "10px" }}
        >
          <NewChatButton
            data-testid="new-chat-button"
            onClick={clearChat}
            sx={{
              padding: "12px",
              border: "1px solid white",
              borderRadius: "5px",
              textAlign: "left",
              transition: "ease 0.25s all",
            }}
          >
            New Chat
          </NewChatButton>
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
        </Box>
        <Box
          data-testid="chat-log-container"
          sx={{
            border: "1px solid green",
            flex: 1,
            backgroundColor: "#343541",
            position: "relative",
            display: "flex",
            displayDirection: "row",
          }}
        >
          <Box data-testid="chat-log" sx={{ textAlign: "left" }}>
            {chatLog.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </Box>
          <Box
            data-testid="chat-input-container"
            sx={{
              padding: "24px",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Input
                value={input}
                placeholder="Type your message here"
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                data-testid="chat-input"
                sx={{
                  backgroundColor: "#40414f",
                  width: "100%",
                  borderRadius: "5px",
                  borderColor: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "1.25em",
                  boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0, 0.25)",
                  color: "white",
                }}
              />
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChatLog;
