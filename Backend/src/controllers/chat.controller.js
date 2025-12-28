const chatModel = require("../Model/chat.model");
const messageModel = require("../Model/message.model");

async function createchat(req, res) {
  try {
    const { title } = req.body;
    const user = req.user;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const chat = await chatModel.create({
      user: user._id,
      title,
    });

    res.status(201).json({
      message: "Chat created successfully",
      chat: {
        _id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
        user: chat.user,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

async function getChats(req, res) {
  try {
    const user = req.user;

    const chats = await chatModel
      .find({ user: user._id })
      .sort({ updatedAt: -1 });

    res.status(200).json({ chats });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

async function getChatMessages(req, res) {
  try {
    const { chatId } = req.params;
    const user = req.user;

    const messages = await messageModel
      .find({ chat: chatId, user: user._id })
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

async function renameChat(req, res) {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const user = req.user;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const chat = await chatModel.findOneAndUpdate(
      { _id: chatId, user: user._id },
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
      message: "Chat renamed successfully",
      chat,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;
    const user = req.user;

    const chat = await chatModel.findOne({
      _id: chatId,
      user: user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await messageModel.deleteMany({ chat: chatId });
    await chat.deleteOne();

    res.status(200).json({
      message: "Chat deleted successfully",
      chatId,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createchat,
  getChats,
  getChatMessages,
  renameChat,
  deleteChat,
};
