const jwt = require("jsonwebtoken");

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
