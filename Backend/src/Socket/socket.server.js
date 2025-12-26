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
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      if (!cookies.token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRETKEY);
      const user = await userModel.findById(decoded.id);
      if (!user) return next(new Error("Authentication error"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("ai-message", async (messagePayload) => {
      try {
        if (!messagePayload?.content || !messagePayload?.chat) return;

        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: messagePayload.content,
            role: "user",
          }),
          aiService.generateVector(messagePayload.content),
        ]);

        await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content,
          },
        });

        const [memory, chatHistoryRaw] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: {
              user: socket.user._id,
            },
          }),
          messageModel
            .find({ chat: messagePayload.chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
        ]);

        const chatHistory = chatHistoryRaw.reverse();

        const stm = chatHistory.map((item) => ({
          role: item.role === "model" ? "assistant" : "user",
          content: item.content,
        }));

        const ltm = memory.length
          ? [
              {
                role: "system",
                content:
                  "The following are relevant past messages from this conversation. Use them only as background knowledge. Do not repeat them unless necessary.\n\n" +
                  memory.map((m) => m.metadata.text).join("\n"),
              },
            ]
          : [];

        const messages = [...ltm, ...stm];

        const response = await aiService.generateResponse(messages);

        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });

        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: response,
            role: "model",
          }),
          aiService.generateVector(response),
        ]);

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: response,
          },
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
