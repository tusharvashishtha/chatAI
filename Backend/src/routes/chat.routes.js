const express = require('express');
const chatRoutes = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const chatcontroller = require('../controllers/chat.controller')

chatRoutes.post('/', authMiddleware.authuser, chatcontroller);

module.exports = chatRoutes;