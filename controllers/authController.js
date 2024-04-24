const { validationResult } = require("express-validator");
const User = require("../models/User");
const {
  hashPassword,
  jwtAuth,
  comparePassword,
} = require("../helpers/authHelper");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "codenesters3@gmail.com",
    pass: process.env.NODEMAILER_GOOGLE_PASSWORD,
  },
});

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
        username: user.username,
        description: user.description,
        phone: user.phone,
        instagram: user.instagram,
        github: user.github,
        linkedin: user.linkedin,
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

//! Update password controller
module.exports.updatePasswordController = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Send reset password link
module.exports.sendResetLinkController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Enter your email",
      });
    }

    let user = await User.findOne({ email });

    const data = {
      userId: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "120s",
    });

    const setUserToken = await User.findByIdAndUpdate(
      { _id: user._id },
      { verifyToken: token },
      { new: true }
    );

    if (setUserToken) {
      const mailOptions = {
        from: "codenesters3@gmail.com",
        to: email,
        subject: "Reset your CodeNesters account password",
        text: `This link will reset your CodeNesters account and is valid only for 2 minutes. https://codenesters.in/reset-password/${user.id}/${setUserToken.verifyToken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(401).json({
            success: false,
            message: "Email not sent",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Email sent successfully",
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Verify valid user while resetting password or when being redirected from the reset password link
module.exports.verifyValidUserController = async (req, res) => {
  try {
    const { id, token } = req.params;

    //* Finding the user in database
    let user = await User.findOne({ _id: id, verifyToken: token });

    //* Verifying user with a valid token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (user && verifiedToken.userId.id) {
      return res.status(200).json({
        success: true,
        message: "User verified successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Reset Password Controller
module.exports.resetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    //* Finding the user in database
    let user = await User.findOne({ _id: id, verifyToken: token });

    //* Verifying user with a valid token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (user && verifiedToken.userId.id) {
      //* Encrypting the new password
      const newSecuredPassword = await hashPassword(password);

      user = await User.findByIdAndUpdate(
        { _id: id },
        { password: newSecuredPassword },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Update User Profile
module.exports.updateUserProfileController = async (req, res) => {
  try {
    //* Destructuring data from request body
    const {
      name,
      email,
      username,
      description,
      phone,
      instagram,
      github,
      linkedin,
    } = req.body;

    //* Checking if the user with provided email exists or not in database
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please login before updating the profile",
      });
    }

    user = await User.findByIdAndUpdate(
      { _id: user.id },
      { name, username, description, phone, instagram, github, linkedin },
      { new: true }
    )
      .select("-password")
      .select("-verifyToken")
      .select("-role");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getAllUsersController = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .select("-verifyToken")
      .select("-role");

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
