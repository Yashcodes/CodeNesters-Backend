const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerForEventController, getAllEventRegistrationsController,
} = require("../controllers/eventController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

//? ROUTE 1 : ROUTE FOR USER EVENT REGISTRATION
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

//? ROUTE 2 : ROUTE FOR GETTING ALL THE USERS REGISTRATIONS BY THE ADMIN
router.get(
  "/get-event-registrations",
  requireSignIn,
  isAdmin,
  getAllEventRegistrationsController
);

module.exports = router;
