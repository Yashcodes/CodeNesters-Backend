const express = require("express");
const router = express.Router();
const { registerController } = require("../controllers/authController");
const { body } = require("express-validator");

//? ROUTE 1 : ROUTE FOR CREATING USER
router.post(
  "/register",
  [
    body("name", "Name must be of 6 characters").exists().isLength({ min: 6 }),
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password must be 8 characters long")
      .exists()
      .isLength({ min: 8 }),
  ],
  registerController
);

module.exports = router;
