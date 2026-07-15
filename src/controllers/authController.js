const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const GuestUser = require("../models/GuestUser");

function createToken(payload, expiresIn) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function setAuthCookie(res, token, maxAgeMs) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: maxAgeMs,
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = createToken({ id: user._id, role: "user" }, "7d");
    setAuthCookie(res, token, 7 * 24 * 60 * 60 * 1000);

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      role: "user",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.guestLogin = async (req, res) => {
  try {
    const guestUser = await GuestUser.create({
      name: `guest_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const token = createToken({ id: guestUser._id, role: "guest" }, "1d");
    setAuthCookie(res, token, 24 * 60 * 60 * 1000);

    return res.status(200).json({
      message: "Guest logged in successfully",
      token,
      role: "guest",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in guest login",
      error: err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
};
