const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courses: [
      {
        _id: false,
        courseId: {
          type: mongoose.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],

    razorpay_payment_id: {
      type: String,
      required: true,
    },

    razorpay_order_id: {
      type: String,
      required: true,
    },

    razorpay_signature: {
      type: String,
      required: true,
    },

    status: {
      type: String,
    },

    amount: {
      type: String,
    },

    amount_paid: {
      type: String,
    },
    
    amount_due: {
      type: String,
    },

    currency: {
      type: String,
    },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
