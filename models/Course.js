const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },

  courseImage: {
    type: String,
    required: true,
  },
  
  courseCategory: {
    type: mongoose.ObjectId,
    ref: "CourseCategory",
    required: true,
  },

  courseCategoryName: {
    type: String,
    required: true,
  },

  courseContent: {
    type: String,
    required: true,
  },

  coursePrice: {
    type: Number,
    required: true,
  },

  coursePriceDiscount: {
    type: Number,
    required: true,
  },

  courseDiscountedPrice: {
    type: Number,
    required: true,
  },

  courseRating: {
    type: Number,
    required: true,
  },

  slug: {
    type: String,
    lowercase: true,
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
