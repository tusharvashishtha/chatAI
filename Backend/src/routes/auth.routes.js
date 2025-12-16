const express = require('express');
const router = express.Router();
const {registeruser , loginuser} = require('../controllers/auth.controller');

router.post('/register',registeruser);
router.post('/login', loginuser)


module.exports = router;