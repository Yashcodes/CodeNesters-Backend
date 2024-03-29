const { validationResult } = require("express-validator");
const Service = require("../models/Service.js");

module.exports.serviceFormController = async (req, res) => {
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
    const { name, email, phone, place, pincode, message, services } = req.body;

    const serviceRequest = await Service.create({
      name,
      email,
      phone,
      place,
      pincode,
      message,
      services,
    });

    //* Destructuring data from request body
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//! Getting all the services requested
module.exports.getServiceRequestsController = async (req, res) => {
  try {
    const serviceRequests = await Service.find();

    res.status(200).json({
      success: true,
      message: "All the service requests fetched successfully",
      serviceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
