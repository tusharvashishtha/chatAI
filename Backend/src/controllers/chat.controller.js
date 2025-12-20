const chatModel = require('../Model/chat.model');

async function createchat(req, res) {
    try {
        const { title } = req.body;
        const user = req.user;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const chat = await chatModel.create({
            user: user._id,
            title
        });

        res.status(201).json({
            message: "Chat created successfully",
            chat: {
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createchat };
