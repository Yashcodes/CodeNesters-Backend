const { validationResult } = require("express-validator");
const Cart = require("../models/Cart");
const NodeCache = require("node-cache");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

    const cart = await Cart.updateOne(
      { userId, "courses.courseId": courseId },
      {
        $set: {
          "courses.$.quantity": quantity,
        },
      }
    );

    if (cart.modifiedCount === 0) {
      await Cart.updateOne(
        { userId },
        {
          $push: {
            courses: {
              courseId,
              quantity: quantity,
            },
          },
        },
        { upsert: true }
      );

      cache.del(userId);

      return res.status(201).json({
        success: true,
        message: "Added to cart successfully",
      });
    } else {
      cache.del(userId);

      return res.status(200).json({
        success: true,
        message: "Your cart has been updated",
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
        path: "courses.courseId",
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

module.exports.deleteCartController = async (req, res) => {};

// module.exports.createPaymentIntentController = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const intent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "inr",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Payment Intent Created Successfully",
//       clientSecret: intent.client_secret,
//       dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${intent.id}`,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

module.exports.createPaymentController = async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
