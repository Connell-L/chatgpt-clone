import { createContext } from "react";

/**
 * A context for the chat log
 *
 * @typedef {Object} ChatLogContext
 * @property {Array} chatLog
 * @property {Function} setChatLog
 * @property {Function} clearChat
 * @property {Array} models
 * @property {Function} setModels
 * @property {String} currentModel
 * @property {Function} setCurrentModel
 * @property {Function} onChange
 * @property {Function} handleSubmit
 * @property {Function} handleToggle
 * @property {Function} handleClose
 * @property {Object} anchorRef
 * @property {Boolean} open
 * @property {Function} setOpen
 * @property {String} input
 * @property {Function} setInput
 * @property {Number} port
 * @property {Function} setPort
 * @property {Function} getEngines
 * @property {Function} onChange
 * @property {Function} handleToggle
 * @property {Function} handleClose
 * @property {Function} onChange
 *
 */

export const ChatLogContext = createContext({
  chatLog: [],
  setChatLog: () => {},
  clearChat: () => {},
  models: [],
  setModels: () => {},
  currentModel: "",
  setCurrentModel: () => {},
  onChange: () => {},
  handleSubmit: () => {},
  handleToggle: () => {},
  handleClose: () => {},
  anchorRef: {},
  open: false,
  setOpen: () => {},
  input: "",
  setInput: () => {},
  port: 5000,
  setPort: () => {},
  getEngines: () => {},
});

ChatLogContext.displayName = "ChatLogContext";
