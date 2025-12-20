const express = require('express');
const chatRoutes = express.Router();

const { authUser } = require('../middlewares/auth.middleware');
const { createchat } = require('../controllers/chat.controller');

chatRoutes.post('/', authUser, createchat);

module.exports = chatRoutes;
