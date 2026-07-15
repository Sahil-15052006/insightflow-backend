const User = require("../models/User");
const GuestUser = require("../models/GuestUser");

async function findAccountByToken({ id, role }) {
  if (role === "guest") {
    return GuestUser.findById(id);
  }

  return User.findById(id).select("-password");
}

module.exports = { findAccountByToken };
