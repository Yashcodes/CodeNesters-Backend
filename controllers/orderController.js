const Order = require("../models/Order");

module.exports.getAllOrdersController = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).select("_id amount createdAt");

    res.status(200).json({
      success: true,
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

module.exports.getOrderDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.find({ _id: id, userId })
      .select("-razorpay_signature")
      .select("-userId")
      .populate({
        path: "courses.courseId",
        model: "Course",
        select:
          "-slug -courseCategory -courseCategoryName -imagePublicId -courseRating",
      });

    res.status(200).json({
      success: true,
      message: "Order Fetched Successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
