const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 });

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
