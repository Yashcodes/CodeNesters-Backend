const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },

  photo: {
    type: String,
  },
});

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

module.exports = UserProfile;
