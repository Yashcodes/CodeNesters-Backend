const express = require("express");
const { body } = require("express-validator");
const {
  registerForEventController,
} = require("../controllers/eventController");
const router = express.Router();

router.post(
  "/register-event",

  //? Express Validation Started
  //! Validating the inputs of user using express validator
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").exists(),
    body("place", "Enter a valid address").exists().isLength({ min: 4 }),
    body("event", "Enter valid event").exists(),
    body("pincode", "Enter must be of 6 digits").exists().isLength({ min: 6 }),
  ],

  registerForEventController
);

module.exports = router;
