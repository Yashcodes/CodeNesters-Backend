const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const { validationResult } = require("express-validator");

//! Form Submit Controller
module.exports.contactFormController = async (req, res) => {
  try {
    //* Checking the results of express validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: "Provide necesssary credentials",
      });
    }

    //* Destructuring data from request body
    const { name, email, phone, address, pincode, message } = req.body;

    let userContact = await Contact.create({
      name,
      email,
      phone,
      address,
      pincode,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Form Submitted Successfully",
      userContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//! Getting all the contact page submission data
module.exports.getAllContactController = async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({
      success: true,
      message: "All contact submissions fetched successfully",
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Deleting a single enquiry entry
module.exports.deleteContactEnquiryController = async (req, res) => {
  try {
    const { id } = req.params;

    await Contact.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Enquiry Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
