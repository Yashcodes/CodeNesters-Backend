const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.requireSignIn = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please authenticate user using a valid token",
    });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data.userId;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Authentication error",
    });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId);

    if (user.role != 1) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
};
