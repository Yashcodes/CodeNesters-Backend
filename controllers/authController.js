const { validationResult } = require("express-validator");
const User = require("../models/User");
const {
  hashPassword,
  jwtAuth,
  comparePassword,
} = require("../helpers/authHelper");

//! Register user controller
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Login user controller
module.exports.loginController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Provide necessary credentials",
      });
    }

    //* Destructuring data from request body
    const { email, password } = req.body;

    //* Checking if the user with provided email exists or not in database
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please try to login with correct credentials",
      });
    }

    //* Comparing the current password and saved password
    const comparedPassword = await comparePassword(password, user.password);

    if (!comparedPassword) {
      return res.status(400).json({
        success: false,
        message: "Please try to login with correct credentials",
      });
    }

    //* User authentication by "authentication token" using "JSONWebToken (JWT)" :::: Using authToken here to send the response to user
    const authToken = await jwtAuth(user);

    res.status(200).json({
      authToken,
      success: true,
      message: "User Logged in Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Get user controller
module.exports.getUserController = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById({ _id: userId });

    res.status(200).json({
      success: true,
      message: "User found",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.updatePasswordController = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  //* Finding the logged in user details with password
  let user = await User.findById({ _id: userId });

  // //* Comparing the received old password with the registered user password
  const comparedPassword = await comparePassword(oldPassword, user.password);

  if (!comparedPassword) {
    return res.status(400).json({
      success: false,
      message: "Wrong old password",
    });
  }

  //* Encrypting the new password
  const newSecuredPassword = await hashPassword(newPassword);

  user = await User.findByIdAndUpdate(
    { _id: userId },
    { password: newSecuredPassword },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });

  // console.log(user);
};
