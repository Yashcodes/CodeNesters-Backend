const express = require("express");
const { body } = require("express-validator");
const {
  serviceFormController,
  getServiceRequestsController,
  deleteServicesEnquiryController
} = require("../controllers/serviceFromController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

//? ROUTE 1 : ROUTE FOR SERVICES FORM SUBMISSION
router.post(
  "/submit", //? Express validation started
  //! Validating the inputs of user using express validator
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").exists(),
    body("place", "Enter a valid address").exists().isLength({ min: 4 }),
    body("services", "Enter some services").isArray().isLength({ min: 1 }),
    body("pincode", "Enter must be of 6 digits").exists().isLength({ min: 6 }),
    body("message", "Message field is required").exists(),
  ],
  //? Express validation ends)
  serviceFormController
);

//? ROUTE 2 : ROUTE FOR GETTING ALL THE SERVICE REQUESTS
router.get(
  "/get-service-requests",
  requireSignIn,
  isAdmin,
  getServiceRequestsController
);

//? ROUTE 3 : ROUTE FOR DELETING A SINGLE ENQUIRY
router.delete(
  "/delete-services-enquiry/:id",
  requireSignIn,
  isAdmin,
  deleteServicesEnquiryController
);

module.exports = router;
