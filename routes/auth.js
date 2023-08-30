const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  res.send("Registering user");
});

module.exports = router;
