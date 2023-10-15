const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  getUserController,
} = require("../controllers/authController");
const { body } = require("express-validator");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

//? ROUTE 1 : ROUTE FOR CREATING USER
router.post(
  "/register",
  [
    body("name", "Name must be of 6 characters").exists().isLength({ min: 6 }),
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password must be 8 characters long")
      .exists()
      .isLength({ min: 8 }),
  ],
  registerController
);

//? ROUTE 2 : ROUTE FOR LOGIN USER
router.post(
  "/login",
  [
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password must be 8 characters long")
      .exists()
      .isLength({ min: 8 }),
  ],
  loginController
);

//? ROUTE 3 : ROUTE FOR GETTING USER DETAILS
router.get("/get-user", requireSignIn, getUserController);

//? ROUTE 4 : PROTECTED ROUTE AUTHENTICATION - USER
router.get("/user-auth", requireSignIn, (req, res) => {
  return res.status(200).json({ ok: true });
});

//? ROUTE 5 : PROTECTED ROUTE AUTHENTICATION - ADMIN
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  return res.status(200).send({ok : true})
})

module.exports = router;
