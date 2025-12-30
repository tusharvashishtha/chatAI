const messageModel = require('../Model/message.model');

async function getMessagesForChat(req, res) {
    try {
        const user = req.user;
        const chatId = req.params.chatId;

        const messages = await messageModel.find({ chat: chatId, user: user._id }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getMessagesForChat };
