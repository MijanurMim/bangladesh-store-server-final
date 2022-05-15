const express = require("express");
const {
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const {
  CreateOrUpdateUser,
  CurrentUser,
} = require("../controllers/userController");

// const { AdminCheckMiddleWare } = require("../middleware/AdminMiddleWare");

const { AuthCheck } = require("../middleware/AuthMiddleWar");

const router = express.Router();

// router.route("/register").post(registerUser);

// router.route("/login").post(loginUser);

// router.route("/password/forgot").post(forgotPassword);

// router.route("/password/reset/:token").put(resetPassword);

// router.route("/logout").get(logout);

// router.route("/me").get(isAuthenticatedUser, getUserDetails);

// router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// new
// Import controllers

// import Middlewares

router.post("/create-or-update-user", AuthCheck, CreateOrUpdateUser);
router.post("/currentuser", AuthCheck, CurrentUser);
//

// router.route("/admin/users").get(AuthCheck, AdminCheckMiddleWare, getAllUser);

// router
//   .route("/admin/user/:id")
//   .get(AuthCheck, AdminCheckMiddleWare, getSingleUser)
//   .put(AuthCheck, AdminCheckMiddleWare, updateUserRole)
//   .delete(AuthCheck, AdminCheckMiddleWare, deleteUser);

module.exports = router;
