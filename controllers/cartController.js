const { validationResult } = require("express-validator");
const Cart = require("../models/Cart");
const NodeCache = require("node-cache");

const cache = new NodeCache();

module.exports.addToCartController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Cart Validation Error",
        errors: errors.array(),
      });
    }

    const userId = req.user.id;
    const { courseId, quantity } = req.body;

    let cart = await Cart.findOne({ userId, course: courseId });

    if (cart) {
      cart = await Cart.findOneAndUpdate(
        { userId, course: courseId },
        { $set: { quantity: cart.quantity + 1 } },
        { new: true }
      );

      cache.del(userId);

      return res.status(200).json({
        success: true,
        message: "Updated cart successfully",
        cart,
      });
    } else {
      cart = await Cart.create({ userId, course: courseId, quantity });

      cache.del(userId);

      return res.status(200).json({
        success: true,
        message: "Added to cart successfully",
        cart,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getUserCartController = async (req, res) => {
  try {
    const userId = req.user.id;

    let cartCourses;

    if (cache.has(userId)) {
      cartCourses = await JSON.parse(cache.get(userId));
    } else {
      cartCourses = await Cart.find({ userId }).select("-userId").populate({
        path: "course",
        model: "Course",
        select:
          "-slug -courseCategory -courseCategoryName -imagePublicId -courseRating",
      });

      cache.set(userId, JSON.stringify(cartCourses));
    }

    res.status(200).json({
      success: true,
      message: "Cart Retrieved Successfully",
      cartCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.deleteCartController = async (req, res) => {
  try {
    const id = req.params.id;

    let cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await Cart.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Cart Item Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.updateCartController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Cart Validation Error",
        errors: errors.array(),
      });
    }

    const id = req.params.id;
    const { quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart = await Cart.findByIdAndUpdate(
      id,
      { $set: { quantity } },
      { new: true }
    );

    cache.del(userId);

    res.status(200).json({
      success: true,
      message: "Cart Item Updated Successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
