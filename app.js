const express = require("express");
const port = 5000;
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello Express...!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
