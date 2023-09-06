const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt);

    return securedPassword;
  } catch (error) {
    return error;
  }
};

module.exports.jwtAuth = (user) => {
  const data = {
    userId: {
      id: user.id,
    },
  };

  const authToken = jwt.sign(data, process.env.JWT_SECRET);

  return authToken;
};

module.exports.comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};
