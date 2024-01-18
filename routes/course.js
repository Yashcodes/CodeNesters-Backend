const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCourseCategoryController,
  createCourseController,
  deleteCourseCategoryController,
  updateCourseCategoryController,
} = require("../controllers/courseController");
const router = express.Router();
const { body } = require("express-validator");

//! ROUTE 1 : CREATE COURSE CATEGORY
router.post(
  "/create-course-category",
  requireSignIn,
  isAdmin,
  createCourseCategoryController
);

router.put(
  "/update-course-category",
  requireSignIn,
  isAdmin,
  updateCourseCategoryController
);

router.delete(
  "/delete-course-category",
  requireSignIn,
  isAdmin,
  deleteCourseCategoryController
);

//! ROUTE 4 : CREATE COURSE
router.post(
  "/create-course",
  requireSignIn,
  isAdmin,
  [
    body("courseName", "Course Name is Required").exists(),
    body("courseCategory", "Course Category Id is Required").exists(),
    body("courseCategoryName", "Course Category Name is Required").exists(),
    body("courseContent", "Course Content is Required").exists(),
    body("coursePrice", "Course Price is Required").exists(),
    body("coursePriceDiscount", "Course Price Discount is Required").exists(),
    body(
      "courseDiscountedPrice",
      "Course Discounted Price is Required"
    ).exists(),
    body("courseRating", "Course Rating is Required").exists(),
  ],
  createCourseController
);

module.exports = router;
