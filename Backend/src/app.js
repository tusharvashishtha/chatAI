const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const router = require('./routes/auth.routes')

app.use(express.json());
app.use(cookieParser());
app.use('/auth', router);

module.exports = app;