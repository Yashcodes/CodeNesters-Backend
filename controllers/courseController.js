const CourseCategory = require("../models/CourseCategory");
const Course = require("../models/Course");

module.exports.createCourseCategoryController = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (categoryName) {
      const courseCategory = await CourseCategory.create({ categoryName });

      res.status(201).json({
        success: true,
        message: "Course Category Created Successfully",
        courseCategory,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.createCourseController = async (req, res) => {
  try {
    const {
      courseName,
      courseCategory,
      courseCategoryName,
      courseContent,
      coursePrice,
      coursePriceDiscount,
      courseDiscountedPrice,
      courseRating,
    } = req.body;

    if (
      courseName &&
      courseCategory &&
      courseCategoryName &&
      courseContent &&
      coursePrice &&
      coursePriceDiscount &&
      courseDiscountedPrice &&
      courseRating
    ) {
      const course = await Course.create({
        courseName,
        courseCategory,
        courseCategoryName,
        courseContent,
        coursePrice,
        coursePriceDiscount,
        courseDiscountedPrice,
        courseRating,
      });

      res.status(201).json({
        success: true,
        message: "Course Created Successfully",
        course,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
