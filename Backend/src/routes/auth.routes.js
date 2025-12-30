const express = require("express");
const router = express.Router();
const { registeruser, loginuser } = require("../controllers/auth.controller");
const {authUser} = require("../middlewares/auth.middleware")

router.post("/register", registeruser);
router.post("/login", loginuser);
router.get("/me", authUser, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
