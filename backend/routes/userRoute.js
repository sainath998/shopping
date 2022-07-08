const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  getAllUsers,
  getSingleUser,
  updateProfile,
  forgetPassword,
  resetPassword,
  updatePassword,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);
// router.route("/password/forget").post(isAuthenticatedUser,forgetPassword);
router.route("/password/forgot").post(isAuthenticatedUser, forgetPassword);
router.route("/password/reset/:token").put(isAuthenticatedUser, resetPassword);
  
router.route("/admin/users").get(isAuthenticatedUser, getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, getSingleUser)
  .put(isAuthenticatedUser, updateUserRole)
  .delete(isAuthenticatedUser, deleteUser);

module.exports = router;
