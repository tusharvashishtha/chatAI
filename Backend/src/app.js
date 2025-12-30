const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://aiva-1104-sable.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/chat/:chatId/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
