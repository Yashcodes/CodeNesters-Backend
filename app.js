const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnect = require("./config/db");
const morgan = require("morgan");
const contact = require("./routes/contact");

//! Port for running NodeJS
const port = 5000;

//! Configure env
dotenv.config();

//! Creating an express app instance
const app = express();

//! Connecting to MongoDB Database
mongoConnect();

//! Using cors
app.use(cors());

//! Middlewares
app.use(express.json());
app.use(morgan("dev"));

//! Routes 
app.use("/api/v1/contact", contact);

app.get("/", (req, res) => {
  res.send("Hello Express...!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
 