const userModel = require("../Model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: true,      // ✅ REQUIRED on Render / HTTPS
  sameSite: "none",  // ✅ REQUIRED for cross-site cookies
};

async function registeruser(req, res) {
  const {
    email,
    fullname: { firstname, lastname },
    password,
  } = req.body;

  const isUserExists = await userModel.findOne({ email });
  if (isUserExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    fullname: { firstname, lastname },
    password: hashPassword,
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRETKEY,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}

async function loginuser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRETKEY,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}

module.exports = { registeruser, loginuser };
