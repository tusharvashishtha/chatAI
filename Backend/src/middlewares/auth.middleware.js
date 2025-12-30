const userModel = require("../Model/user.model");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
  const user = await userModel.findById(decoded.id);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  req.user = user;
  next();
}

module.exports = { authUser };
