const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/user.model");
const aiService = require("../service/ai.service");
const messageModel = require("../Model/message.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRETKEY);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      try {
        if (!messagePayload?.content || !messagePayload?.chat) return;

        // Save user message first
        await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        });

        // Fetch UPDATED chat history AFTER saving user message
        const chatHistory = (await messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()).reverse();

        // Generate AI response with full context
        const response = await aiService.generateResponse(chatHistory);

        // Save AI response 
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
        console.error("Socket error:", error);
        socket.emit("ai-response", {
          content: "AI service error. Please try again.",
          chat: messagePayload.chat,
        });
      }
    });
  });
}

module.exports = initSocketServer;