const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createCourseCategoryController } = require("../controllers/courseController");
const router = express.Router();

//! ROUTE 1 :
router.post("/create-course-category", requireSignIn, isAdmin, createCourseCategoryController);

module.exports = router;
