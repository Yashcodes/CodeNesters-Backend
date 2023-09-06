const { validationResult } = require("express-validator");
const User = require("../models/User");
const { hashPassword, jwtAuth } = require("../helpers/authHelper");

module.exports.registerController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: "Provide necessary credentials",
      });
    }

    //* Destructuring data from request body
    const { name, email, password } = req.body;

    //* Validating if the requested user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Sorry, a user with this email already exists",
      });
    }

    //* Hashing password using bcryptjs
    const securedPassword = await hashPassword(password);

    //* Creating user
    user = await User.create({
      name,
      email,
      password: securedPassword,
    });

    //* User authentication by "authentication token" using "JSONWebToken (JWT)" :::: Using authToken here to send the response to user
    const authToken = await jwtAuth(user);

    res.status(201).json({
      authToken,
      success: true,
      message: "User Registed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Interna Server Error",
      error: error.message,
    });
  }
};
