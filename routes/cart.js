const express = require("express");
const router = express.Router();

const { requireSignIn } = require("../middlewares/authMiddleware");
const {
  addToCartController,
  getUserCartController,
} = require("../controllers/cartController");
const { body } = require("express-validator");

//? ROUTE 1: ADD TO CART
router.post(
  "/add-to-cart",
  [
    body("courseId", "Course Id is required").exists().isLength({ min: 20 }),
    body("quantity", "Quantity should be a number").exists().isNumeric(),
  ],
  requireSignIn,
  addToCartController
);

//? ROUTE 2: GETTING CART DATA
router.get("/get-user-cart", requireSignIn, getUserCartController);

module.exports = router;
