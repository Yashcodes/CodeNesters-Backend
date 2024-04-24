const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  getUserController,
  updatePasswordController,
  sendResetLinkController,
  verifyValidUserController,
  resetPasswordController,
  updateUserProfileController,
  getAllUsersController,
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
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  return res.status(200).send({ ok: true });
});

//? ROUTE 6 : UPDATE USER PASSWORD
router.put("/update-password", requireSignIn, updatePasswordController);

//? ROUTE 7 : SEND PASSWORD RESET LINK
router.post("/send-reset-link", sendResetLinkController);

//? ROUTE 8 : VERIFY USER FOR RESETTING PASSWORD
router.get("/verify-reset-user/:id/:token", verifyValidUserController);

//? ROUTE 9 : RESET PASSWORD
router.post("/reset-password/:id/:token", resetPasswordController);

//? ROUTE 10 : UPDATE USER PROFILE
router.put("/update-user-profile", requireSignIn, updateUserProfileController);

//? ROUTE 10 : UPDATE USER PROFILE
router.get("/get-all-users", requireSignIn, isAdmin, getAllUsersController);

module.exports = router;
