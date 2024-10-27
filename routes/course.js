const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCourseCategoryController,
  createCourseController,
  deleteCourseCategoryController,
  updateCourseCategoryController,
  deleteCourseController,
  getAllCoursesController,
  getAllCourseCategoryController,
  getCourseController,
  uploadCourseImageController,
  getCourseImageController,
  courseFormSubmitController,
  getCourseEnquiriesController,
  updateCourseController,
} = require("../controllers/courseController");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const { imageFileFilter } = require("../helpers/fileFilter");

const storage = multer.memoryStorage();
const maxSize = 1 * 1024 * 1024;

const upload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    imageFileFilter(file, cb);
  },
});

//! ROUTE 1 : CREATE COURSE CATEGORY
router.post(
  "/create-course-category",
  requireSignIn,
  isAdmin,
  createCourseCategoryController
);

//! ROUTE 2: UPDATE COURSE CATEGORY
router.put(
  "/update-course-category",
  requireSignIn,
  isAdmin,
  updateCourseCategoryController
);

//! ROUTE 3: DELETE COURSE CATEGORY
router.delete(
  "/delete-course-category",
  requireSignIn,
  isAdmin,
  deleteCourseCategoryController
);

//! ROUTE4: GETTING ALL COURSE CATEGORIES
router.get(
  "/get-all-course-categories",
  requireSignIn,
  isAdmin,
  getAllCourseCategoryController
);

//! ROUTE 5 : CREATE COURSE
router.post(
  "/create-course",
  requireSignIn,
  isAdmin,
  upload.single("courseImage"),
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

//! ROUTE 6 : DELETE COURSE
router.delete("/delete-course", requireSignIn, isAdmin, deleteCourseController);

//! ROUTE 7: UPDATE COURSE
router.put("/update-course/:id", requireSignIn, isAdmin, updateCourseController)

//! ROUTE 8 : GET ALL COURSES
router.get("/get-all-courses", getAllCoursesController);

//! ROUTE 9 : GET SINGLE COURSES
router.get("/get-course/:id", getCourseController);

//! ROUTE 10 : UPLOAD COURSE IMAGE
router.post(
  "/upload-course-image",
  requireSignIn,
  isAdmin,
  uploadCourseImageController
);

//! ROUTE 11 : GETTING COURSE IMAGE URL
router.post("/get-course-image", getCourseImageController);

//! ROUTE 12 : SUBMITTING THE COURSE ENQUIRY
router.post(
  "/course-form-submit",
  //? Express validation started
  //! Validating the inputs of user using express validator
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").exists(),
    body("place", "Enter a valid address").exists().isLength({ min: 4 }),
    body("courses", "Enter some courses").isArray().isLength({ min: 1 }),
    body("pincode", "Enter must be of 6 digits").exists().isLength({ min: 6 }),
    body("message", "Message field is required").exists(),
  ],
  //? Express validation ends)
  courseFormSubmitController
);

//! ROUTE 13 : GET COURSE ENQUIRIES
router.get(
  "/get-course-enquiries",
  requireSignIn,
  isAdmin,
  getCourseEnquiriesController
);

module.exports = router;
