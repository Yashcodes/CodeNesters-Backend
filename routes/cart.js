const express = require("express");
const router = express.Router();

const { requireSignIn } = require("../middlewares/authMiddleware");
const {
  addToCartController,
  getUserCartController,
  deleteCartController,
  updateCartController,
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

//? ROUTE 3: DELETE A CART ITEM
router.delete("/delete-cart-item/:id", requireSignIn, deleteCartController);

//? ROUTE 4: UPDATE A CART ITEM
router.put(
  "/update-cart-item/:id",
  [body("quantity", "Quantity should exist").exists().isNumeric()],
  requireSignIn,
  updateCartController
);

module.exports = router;
