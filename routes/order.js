const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { getAllOrdersController } = require("../controllers/orderController");

const router = express.Router();

router.get("/get-all-orders", requireSignIn, getAllOrdersController)

module.exports = router;
