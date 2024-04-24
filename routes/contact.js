const express = require("express");
const { body } = require("express-validator");
const {
  contactFormController,
  getAllContactController,
  deleteContactEnquiryController
} = require("../controllers/contactFormController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

//? ROUTE 1 : Route for submitting the contact form
router.post(
  "/form-submit",

  //? Express validation started
  //! Validating the inputs of user using express validator
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").exists(),
    body("address", "Enter a valid address").exists().isLength({ min: 8 }),
    body("pincode", "Enter must be of 6 digits").exists().isLength({ min: 6 }),
    body("message", "Message field is required").exists(),
  ],
  //? Express validation ends
  contactFormController
);

//? ROUTE 2 : ROUTE FOR GETTING ALL THE CONTACT US PAGE INFORMATION
router.get("/get-all-contact", requireSignIn, isAdmin, getAllContactController);

//? ROUTE 3 : ROUTE FOR DELETING A SINGLE ENQUIRY
router.delete("/delete-contact-enquiry/:id", requireSignIn, isAdmin, deleteContactEnquiryController);

module.exports = router;
