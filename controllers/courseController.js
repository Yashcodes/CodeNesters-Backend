const CourseCategory = require("../models/CourseCategory");
const Course = require("../models/Course");
const slugify = require("slugify");


//? CONTROLLERS FOR COURSE CATEGORY
module.exports.createCourseCategoryController = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        message: "Category Name is Required",
      });
    }

    let courseCategory = await CourseCategory.findOne({ categoryName });

    if (courseCategory) {
      return res.status(400).json({
        success: false,
        message: "Category Already Exists",
      });
    }

    courseCategory = await CourseCategory.create({
      categoryName,
      slug: slugify(categoryName),
    });

    res.status(201).json({
      success: true,
      message: "Course Category Created Successfully",
      courseCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//! Need modifications : May have bugs
module.exports.updateCourseCategoryController = async (req, res) => {
  try {
    console.log(req.params)
    const { categoryName } = req.body;
    const { id } = req.params;

    const courseCategory = await CourseCategory.findByIdAndUpdate(
      id,
      {
        categoryName,
        slug: slugify(categoryName),
      },
      { new: true }
    );

    res.status(204).json({
      success: true,
      message: "Category Updated Successfully",
      courseCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.deleteCourseCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    await Course.deleteMany({ courseCategory: _id });
    await CourseCategory.findByIdAndDelete({ _id });

    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//? CONTROLLERS FOR COURSES
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
