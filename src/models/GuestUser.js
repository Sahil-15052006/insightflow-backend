const mongoose = require("mongoose");

const guestUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true, collection: "guest_users" }
);

module.exports = mongoose.model("GuestUser", guestUserSchema);
