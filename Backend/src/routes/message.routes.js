const express = require('express');
const messageRoutes = express.Router({ mergeParams: true });
const { authUser } = require('../middlewares/auth.middleware');
const { getMessagesForChat } = require('../controllers/message.controller');

// Get all messages for a chat
messageRoutes.get('/', authUser, getMessagesForChat);

module.exports = messageRoutes;
