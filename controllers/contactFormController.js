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
      message
    });

    res.status(200).json({
      success: true,
      message: "Form Submitted Successfully",
      userContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
