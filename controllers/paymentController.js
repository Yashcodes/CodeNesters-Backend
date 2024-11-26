const { razorPay } = require("../config/paymentConfig");
const crypto = require("crypto");
const Cart = require("../models/Cart");
const { cache } = require("../config/cacheConfig");
const Order = require("../models/Order");

module.exports.createPaymentController = async (req, res) => {
  const { amount, courses } = req.body;

  try {
    const course = JSON.parse(courses);

    const notes = course.reduce((acc, courseId, index) => {
      acc[`course_${index + 1}`] = courseId; // Create key-value pairs
      return acc;
    }, {});

    const options = {
      amount: amount * 100,
      currency: "INR",
      notes: notes,
    };

    const order = await razorPay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.verifyPaymentController = async (req, res) => {
  const { userId } = req.query;
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthenticated = generatedSignature === razorpay_signature;

    if (isAuthenticated) {
      await Cart.deleteMany({ userId });

      cache.del(`cart${userId}`);

      const order = await razorPay.orders.fetch(razorpay_order_id);
      console.log(order);

      let coursesArray = Object.values(order?.notes).map((courseId) => ({
        courseId,
      }));

      const storedOrder = await Order.create({
        userId,
        courses: coursesArray,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: order.status,
        amount: order.amount,
        amount_paid: order.amount_paid,
        amount_due: order.amount_due,
        currency: order.currency,
      });

      res.redirect(
        `https://codenesters.in/dashboard/user/payment?referenceId=${razorpay_payment_id}`
      );
    } else {
      res.status(402).json({
        success: false,
        message: "Verification Error",
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
