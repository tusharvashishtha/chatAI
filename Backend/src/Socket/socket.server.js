const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/user.model");
const aiService = require("../service/ai.service");
const messageModel = require("../Model/message.model");
const { createMemory, queryMemory } = require("../service/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRETKEY);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication error"));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("ai-message", async (messagePayload) => {
      try {
        if (!messagePayload?.content || !messagePayload?.chat) return;

        await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        });

        const vectors = await aiService.generateVector(messagePayload.content);
        console.log(vectors)
        await createMemory({
          vectors,
          messageId: "77777",
          metadata : {
            chat: messagePayload.chat,
            user: socket.user._id
          }
        })

        const chatHistory = (
          await messageModel
            .find({ chat: messagePayload.chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
        ).reverse();

        const response = await aiService.generateResponse(chatHistory);

        await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: response,
          role: "model",
        });

        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });
      } catch (error) {
        console.error(error);
        socket.emit("ai-response", {
          content: "AI service error. Please try again.",
          chat: messagePayload.chat,
        });
      }
    });
  });
}

module.exports = initSocketServer;
