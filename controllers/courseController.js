const CourseCategory = require("../models/CourseCategory");
const Course = require("../models/Course");
const slugify = require("slugify");
const { validationResult } = require("express-validator");
const { putObjectURL, getObjectURL } = require("../routes/services/s3");
const CourseEnquiry = require("../models/CourseEnquiry");
const NodeCache = require("node-cache");

const cache = new NodeCache();

//? CONTROLLERS FOR CREATING COURSE CATEGORY
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

//TODO Need modifications : May have bugs
module.exports.updateCourseCategoryController = async (req, res) => {
  try {
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

//? CONTROLLER FOR DELETING COURSE CATEGORY
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

//? CONTROLLER FOR GETTING ALL THE COURSE CATEGORIES
module.exports.getAllCourseCategoryController = async (req, res) => {
  try {
    const categories = await CourseCategory.find();

    res.status(200).json({
      success: true,
      message: "Course Categories Retrieved Successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//? CONTROLLERS FOR CREATING COURSES
module.exports.createCourseController = async (req, res) => {
  try {
    //* Checking the validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Provide necessary data for creating course",
        errors: errors.array(),
      });
    }

    //* Destructuring course data from the request's body
    const {
      courseName,
      courseCategory,
      courseImage,
      courseCategoryName,
      courseContent,
      coursePrice,
      coursePriceDiscount,
      courseDiscountedPrice,
      courseRating,
    } = req.body;

    let course = await Course.findOne({ courseName });

    if (course) {
      return res.status(400).json({
        success: false,
        message: "Course Already Exists",
      });
    }

    course = await Course.create({
      courseName,
      courseCategory,
      courseImage,
      courseCategoryName,
      courseContent,
      coursePrice,
      coursePriceDiscount,
      courseDiscountedPrice,
      courseRating,
      slug: slugify(courseName),
    });

    res.status(201).json({
      success: true,
      message: "Course Created Successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//? CONTROLLER FOR DELETING COURSE
module.exports.deleteCourseController = async (req, res) => {
  try {
    const { _id } = req.body;

    await Course.findByIdAndDelete({ _id });

    res.status(200).json({
      success: true,
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//? CONTROLLER FOR GETTING ALL THE COURSES
module.exports.getAllCoursesController = async (req, res) => {
  try {
    let courses;

    if (cache.has("courses")) {
      courses = JSON.parse(cache.get("courses"));
    } else {
      courses = await Course.find();
      cache.set("courses", JSON.stringify(courses));
    }

    res.status(200).json({
      success: true,
      message: "Courses Retrieved Successfully",
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//? CONTROLLER FOR GETTING A SINGLE COURSE
module.exports.getCourseController = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Course Retrieved Successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//? CONTROLLER FOR UPLOADING COURSE IMAGE TO S3
module.exports.uploadCourseImageController = async (req, res) => {
  try {
    const url = await putObjectURL(
      `uploads/courses/${req.body.fileName}`,
      req.body.contentType
    );

    res.status(200).json({
      success: true,
      message: "Upload URL Generated Successfully",
      url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in generating upload URL",
      error: error.message,
    });
  }
};

//? CONTROLLER FOR GETTING COURSE IMAGE FROM S3
module.exports.getCourseImageController = async (req, res) => {
  try {
    const url = await getObjectURL(req.body.key);

    res.status(200).json({
      success: true,
      message: "Course Image URL Generated Successfully",
      url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in generating Get Course URL",
      error: error.message,
    });
  }
};

//? CONTROLLER FOR SUBMITTING THE COURSE ENQUIRY FORM
module.exports.courseFormSubmitController = async (req, res) => {
  try {
    //* Checking the results of express validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: "Provide necesssary credentials",
      });
    }

    //* Destructuring data from request body
    const { name, email, phone, place, pincode, message, courses } = req.body;

    const courseRequest = await CourseEnquiry.create({
      name,
      email,
      phone,
      place,
      pincode,
      message,
      courses,
    });

    res.status(200).json({
      success: true,
      message: "Courses Enquiry Submitted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//? CONTROLLER FOR GETTING ALL THE COURSE REGARDED ENQUIRIES
module.exports.getCourseEnquiriesController = async (req, res) => {
  try {
    const courseEnquiries = await CourseEnquiry.find();

    res.status(200).json({
      success: true,
      message: "Course Enquiries Fetched Successfully",
      courseEnquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
