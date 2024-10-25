const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware");
const {
  createPaymentController,
  verifyPaymentController,
} = require("../controllers/paymentController");
const router = express.Router();

router.post("/create-payment", requireSignIn, createPaymentController);

router.post("/verify-payment", verifyPaymentController);

module.exports = router;
