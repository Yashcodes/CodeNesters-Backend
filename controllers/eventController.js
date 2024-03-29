const { validationResult } = require("express-validator");
const Event = require("../models/Event.js");

module.exports.registerForEventController = async (req, res) => {
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
    const { name, email, phone, place, event, pincode } = req.body;

    const eventRegister = await Event.create({
      name,
      email,
      phone,
      place,
      event,
      pincode,
    });

    res.status(200).json({
      success: true,
      message: "Form Submitted Successfully",
      eventRegister,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Get all the event registrations
module.exports.getAllEventRegistrationsController = async (req, res) => {
  try {
    const registrations = await Event.find();

    res.status(200).json({
      success: true,
      message: "All event registrations fetched successfully",
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
