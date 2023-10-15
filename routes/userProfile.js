const express = require("express");
const mongoose = require("mongoose");
const {
  userProfileController,
} = require("../controllers/userProfileController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/user-profile", requireSignIn, userProfileController);

module.exports = router;
