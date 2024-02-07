const express = require("express");
const { body } = require("express-validator");
const {
  serviceFormController,
} = require("../controllers/serviceFromController");

const router = express.Router();

router.post(
  "/submit", //? Express validation started
  //! Validating the inputs of user using express validator
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").exists(),
    body("place", "Enter a valid address").exists().isLength({ min: 8 }),
    body("services", "Enter some services").isArray().isLength({ min: 1 }),
    body("pincode", "Enter must be of 6 digits").exists().isLength({ min: 6 }),
    body("message", "Message field is required").exists(),
  ],
  //? Express validation ends)
  serviceFormController
);

module.exports = router;
