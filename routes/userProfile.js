const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
const {
  userProfileController,
} = require("../controllers/userProfileController");
const { getObjectURL, putObjectURL } = require("./services/s3.js");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

// router.post("/user-profile", requireSignIn, userProfileController);

//? ROUTE 1: Route for getting putObject Url
router.post("/putObjectUrl", requireSignIn, async (req, res) => {
  try {
    const url = await putObjectURL(req.body.fileName, req.body.contentType);

    res.status(200).json({
      success: true,
      message: "Put Object URL Generated Successfully",
      url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in generating Put Object URL",
      url,
    });
  }
});

//? ROUTE 2: Route for getting getObject Url
router.post("/getObjectUrl", requireSignIn, async (req, res) => {
  try {
    const url = await getObjectURL(req.body.key);

    res.status(200).json({
      success: true,
      message: "Get Object URL Generated Successfully",
      url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in generating Get Object URL",
      url,
    });
  }
});

module.exports = router;
