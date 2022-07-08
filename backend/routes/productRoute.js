const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles
} = require("../middleware/auth");

const router = express.Router();

// removed admin and athenticated
router
  .route("/products")
  .get(getAllProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct)
  .get(getProductDetails);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, getAdminProducts);




router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(deleteReview);

module.exports = router;