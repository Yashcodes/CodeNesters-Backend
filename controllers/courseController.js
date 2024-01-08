const CourseCategory = require("../models/CourseCategory");

module.exports.createCourseCategoryController = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const course = CourseCategory.create({ categoryName });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
