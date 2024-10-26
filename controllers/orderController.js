const Order = require("../models/Order");

module.exports.getAllOrdersController = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .select("-razorpay_signature")
      .select("-userId")
      .populate({
        path: "courses.courseId",
        model: "Course",
        select:
          "-slug -courseCategory -courseCategoryName -imagePublicId -courseRating",
      });

    res.status(200).json({
      success: false,
      message: "Order Fetched Successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
