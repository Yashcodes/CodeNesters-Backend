const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [
    {
      courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  razorPay_payment_id: {
    type: String,
    required: true,
  },
  razorPay_order_id: {
    type: String,
    required: true,
  },
  razorPay_order_id: {
    type: String,
    required: true,
  },
});
