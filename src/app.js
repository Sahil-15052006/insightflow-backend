const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const uploadRoutes = require("./routes/uploadRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const datasetRoutes = require("./routes/datasetRoutes");
const { findAccountByToken } = require("./services/userService");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/uploadFile", uploadRoutes);
app.use("/analyzeData", analyzeRoutes);
app.use("/api/datasets", datasetRoutes);

app.get("/userInfo", authMiddleware, async (req, res) => {
  try {
    const user = await findAccountByToken(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        ...user.toObject(),
        role: req.user.role,
      },
    });
  } catch {
    return res.status(500).json({ message: "Failed to get user data" });
  }
});

app.get("/auth/verify", authMiddleware, (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = app;
