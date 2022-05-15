const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,

  createProductReview,
  getProductDetails,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const { AdminCheckMiddleWare } = require("../middleware/AdminMiddleWare");

const { AuthCheck } = require("../middleware/AuthMiddleWar");

const router = express.Router();

router.route("/products").get(getAllProducts);

// router
//   .route("/admin/products")
//   .get(AuthCheck, AdminCheckMiddleWare, getAdminProducts);

router
  .route("/admin/product/new")
  .post(AuthCheck, AdminCheckMiddleWare, createProduct);

router
  .route("/admin/product/:id")
  .put(AuthCheck, AdminCheckMiddleWare, updateProduct)
  .delete(AuthCheck, AdminCheckMiddleWare, deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(AuthCheck, createProductReview);

router.route("/reviews").get(getProductReviews).delete(AuthCheck, deleteReview);

module.exports = router;
