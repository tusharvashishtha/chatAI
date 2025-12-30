const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/user.model");
const messageModel = require("../Model/message.model");
const aiService = require("../service/ai.service");
const { createMemory, queryMemory } = require("../service/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) return next(new Error("Auth error"));

    const decoded = jwt.verify(cookies.token, process.env.JWT_SECRETKEY);
    const user = await userModel.findById(decoded.id);
    if (!user) return next(new Error("Auth error"));

    socket.user = user;
    next();
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async ({ chat, content }) => {
      if (!chat || !content) return;

      const [userMessage, userVector] = await Promise.all([
        messageModel.create({
          chat,
          user: socket.user._id,
          content,
          role: "user",
        }),
        aiService.generateVector(content),
      ]);

      const shouldStore =
        /my name is|call me|i am from|i like|remember that/i.test(
          content.toLowerCase()
        );

      if (shouldStore) {
        await createMemory({
          vectors: userVector,
          messageId: userMessage._id,
          metadata: {
            user: socket.user._id.toString(),
            text: content,
          },
        });
      }

      const memory = await queryMemory({
        queryVector: userVector,
        limit: 5,
        metadata: {
          user: socket.user._id.toString(),
        },
      });

      const historyRaw = await messageModel
        .find({ chat })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const history = historyRaw.reverse().map((m) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.content,
      }));

      const systemMemory = memory.length
        ? [
            {
              role: "system",
              content:
                "Known facts about the user:\n" +
                memory.map((m) => "- " + m.metadata.text).join("\n"),
            },
          ]
        : [];

      const response = await aiService.generateResponse([
        ...systemMemory,
        ...history,
      ]);

      socket.emit("ai-response", { chat, content: response });

      const [aiMessage, aiVector] = await Promise.all([
        messageModel.create({
          chat,
          user: socket.user._id,
          content: response,
          role: "model",
        }),
        aiService.generateVector(response),
      ]);

      await createMemory({
        vectors: aiVector,
        messageId: aiMessage._id,
        metadata: {
          user: socket.user._id.toString(),
          text: response,
        },
      });
    });
  });
}

module.exports = initSocketServer;
