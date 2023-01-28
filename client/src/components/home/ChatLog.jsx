import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";

export const ChatMessage = ({ message }) => {
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

const transformOrigin = {
  vertical: "top",
  horizontal: "center",
};

const anchorOrigin = {
  vertical: "bottom",
  horizontal: "center",
};

export const ChatLog = () => {
  const port = process.env.PORT || 8080;

  // Initialize the chatLog state as an empty array
  const [input, setInput] = useState("");
  const [models, setModels] = useState(null);
  const [currentModel, setCurrentModel] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

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

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    console.log(`handleClose, current model: ${currentModel}`);
  }, [currentModel]);

  const menuItems = [];

  const StyledMenuItem = styled(MenuItem)({
    paddingLeft: 16,
    "&:hover": {
      color: "white",
      backgroundColor: "#f73b3b",
    },
  });

  function modelItems() {
    if (models !== null) {
      return models.forEach((model) => {
        menuItems.push(
          <StyledMenuItem key={model.id} value={model.id}>
            {model.id}
          </StyledMenuItem>
        );
      });
    }
  }

  modelItems();

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
          sx={{
            width: "260px",
            padding: "10px",
          }}
        >
          <Box data-testid="buttons-container">
            <div>
              <Button
                data-testid="new-chat-button"
                onClick={clearChat}
                size="large"
                variant="outlined"
                sx={{
                  padding: "12px",
                  border: "1px solid white",
                  borderRadius: "5px",
                  textAlign: "left",
                  transition: "ease 0.25s all",
                  color: "white",
                  marginTop: "16px",
                  minWidth: "80%",
                }}
              >
                New Chat
              </Button>
            </div>
            <div>
              <Button
                data-testid="model-button"
                onClick={handleToggle}
                variant="outlined"
                ref={anchorRef}
                value={currentModel}
                aria-label={`Click to ${open ? "open" : "close"}  models menu`}
                aria-controls={open ? "models-select" : undefined}
                aria-haspopup="true"
                placeholder="Select a model"
                size="large"
                sx={{
                  padding: "12px",
                  border: "1px solid white",
                  borderRadius: "5px",
                  textAlign: "left",
                  transition: "ease 0.25s all",
                  color: "white",
                  marginTop: "10px",
                  backgroundColor: "primary",
                  minWidth: "80%",
                }}
              >
                {currentModel}
              </Button>
              <Menu
                id="models-select"
                anchorEl={anchorRef.current}
                variant="menu"
                transformOrigin={transformOrigin}
                anchorOrigin={anchorOrigin}
                value={currentModel}
                onClose={handleClose}
                onChange={(e) => {
                  setCurrentModel(e.target.value);
                }}
                open={open}
                onClick={handleToggle}
                sx={{
                  maxWidth: "260px",
                  maxHeight: "50%",
                }}
                PaperProps={{
                  style: {
                    marginTop: "4px",
                    borderRadius: "16px",
                  },
                }}
              >
                <StyledMenuItem disabled sx={{ color: "#f73b3b" }}>
                  Select a model.
                </StyledMenuItem>
                <Divider variant="middle" />
                {menuItems}
              </Menu>
            </div>
          </Box>
        </Box>
        <Box
          data-testid="chat-log-container"
          sx={{
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
