const mongoose = require("mongoose");

const CourseEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  place: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  courses: {
    type: Array,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },
});

const CourseEnquiry = mongoose.model("CourseEnquiry", CourseEnquirySchema);
module.exports = CourseEnquiry;
