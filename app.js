const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnect = require("./config/db");
const morgan = require("morgan");
const contact = require("./routes/contact");
const auth = require("./routes/auth");
const userProfile = require("./routes/userProfile");
const course = require("./routes/course");
const service = require("./routes/service");
const event = require("./routes/event");
const cart = require("./routes/cart");
const payment = require("./routes/payment");
const cloudinary = require("cloudinary").v2;

//! Port for running NodeJS
const port = 5000;

//! Configure env
dotenv.config();

//! Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//! Creating an express app instance
const app = express();

//! Connecting to MongoDB Database
mongoConnect();

//! Using cors
app.use(cors());

//! Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//! Routes
app.use("/api/v1/contact", contact);
app.use("/api/v1/auth", auth);
app.use("/api/v1/course", course);
app.use("/api/v1/service", service);
app.use("/api/v1/event", event);
app.use("/api/v1/user", userProfile);
app.use("/api/v1/cart", cart);
app.use("/api/v1/payment", payment);

app.get("/", (req, res) => {
  res.send("Hello Express...!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
