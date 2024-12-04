const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { getAllOrdersController, getOrderDetailsController } = require("../controllers/orderController");

const router = express.Router();

router.get("/get-all-orders", requireSignIn, getAllOrdersController);

router.get("/get-order/:id", requireSignIn, getOrderDetailsController);

module.exports = router;
