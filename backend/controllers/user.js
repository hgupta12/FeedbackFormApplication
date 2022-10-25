const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Input fields missing");
  }
  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("User already exists");
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: `https://avatars.dicebear.com/api/initials/${encodeURIComponent(name)}.svg`,
  });
  const token = generateToken({
    id: newUser._id,
    email: newUser.email,
  });
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar:newUser.avatar,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Input fields missing");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken({
      id: user._id,
      email: user.email,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar:user.avatar,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials!");
  }
});

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  registerUser,
  loginUser,
};
