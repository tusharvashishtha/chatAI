const userModel = require("../Model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      fullname: {
        firstname,
        lastname,
      },
    password: hashPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY);
  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    user: {
      email: user.email,
      _id: user._id,
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

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "User logged in successfully",
    token,
    user: {
      email: user.email,
      _id: user._id,
      fullname: user.fullname,
    },
  });
}


module.exports = { registeruser, loginuser };
