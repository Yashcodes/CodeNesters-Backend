const mongoose = require("mongoose");

const CourseCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    lowercase: true,
  },
});

const CourseCategory = mongoose.model("CourseCategory", CourseCategorySchema);

module.exports = CourseCategory;
