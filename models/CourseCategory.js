const mongoose = require("mongoose");

const CourseCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
});

const CourseCategory = mongoose.model("CourseCategory", CourseCategorySchema);

module.exports = CourseCategory;
