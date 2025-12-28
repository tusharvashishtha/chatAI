const express = require("express");
const chatRoutes = express.Router();
const { authUser } = require("../middlewares/auth.middleware");
const {
  createchat,
  getChats,
  getChatMessages,
  renameChat,
  deleteChat,
} = require("../controllers/chat.controller");

chatRoutes.get("/", authUser, getChats);
chatRoutes.post("/", authUser, createchat);
chatRoutes.put("/:chatId", authUser, renameChat);
chatRoutes.delete("/:chatId", authUser, deleteChat);
chatRoutes.get("/:chatId/messages", authUser, getChatMessages);

module.exports = chatRoutes;
