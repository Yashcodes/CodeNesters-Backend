const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCourseCategoryController,
  createCourseController,
} = require("../controllers/courseController");
const router = express.Router();

//! ROUTE 1 : CREATE COURSE CATEGORY
router.post(
  "/create-course-category",
  requireSignIn,
  isAdmin,
  createCourseCategoryController
);

//! ROUTE 2 : CREATE COURSE
router.post("/create-course", requireSignIn, isAdmin, createCourseController);

module.exports = router;
