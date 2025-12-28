const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/user.model");
const aiService = require("../service/ai.service");
const messageModel = require("../Model/message.model");
const { createMemory, queryMemory } = require("../service/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

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
    socket.on("ai-message", async ({ chat, content }) => {
      try {
        if (!chat || !content) return;

        const [userMessage, vectors] = await Promise.all([
          messageModel.create({
            chat,
            user: socket.user._id,
            content,
            role: "user",
          }),
          aiService.generateVector(content),
        ]);

        await createMemory({
          vectors,
          messageId: userMessage._id,
          metadata: {
            chat,
            user: socket.user._id,
            text: content,
          },
        });

        const [memory, historyRaw] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: { user: socket.user._id },
          }),
          messageModel
            .find({ chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
        ]);

        const history = historyRaw.reverse().map((m) => ({
          role: m.role === "model" ? "assistant" : "user",
          content: m.content,
        }));

        const system = memory.length
          ? [
              {
                role: "system",
                content:
                  "Relevant previous messages:\n" +
                  memory.map((m) => m.metadata.text).join("\n"),
              },
            ]
          : [];

        const response = await aiService.generateResponse([
          ...system,
          ...history,
        ]);

        socket.emit("ai-response", { content: response, chat });

        const [aiMessage, aiVectors] = await Promise.all([
          messageModel.create({
            chat,
            user: socket.user._id,
            content: response,
            role: "model",
          }),
          aiService.generateVector(response),
        ]);

        await createMemory({
          vectors: aiVectors,
          messageId: aiMessage._id,
          metadata: {
            chat,
            user: socket.user._id,
            text: response,
          },
        });
      } catch {
        socket.emit("ai-response", {
          content: "AI service error. Please try again.",
          chat,
        });
      }
    });
  });
}

module.exports = initSocketServer;
