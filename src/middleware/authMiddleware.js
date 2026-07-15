const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  let token = req.cookies?.token;

  if (!token && req.header("Authorization")) {
    token = req.header("Authorization").split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified?.id || !verified?.role) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = verified;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
