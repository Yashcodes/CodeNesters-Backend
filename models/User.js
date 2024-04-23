const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: Number,
      default: 0,
    },

    verifyToken: {
      type: String,
    },

    phone: {
      type: String,
      default: "Your phone number here",
    },

    description: {
      type: String,
      default: "Your profile description here",
    },

    username: {
      type: String,
      default: "Your username here",
    },

    instagram: {
      type: String,
    },

    github: {
      type: String,
    },

    linkedin: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
