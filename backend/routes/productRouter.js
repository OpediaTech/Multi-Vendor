const express = require("express");

const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
  getCategories,
  Stripehandler,
  getAllCategories,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getProducts).post(createProduct);
router.route("/payment").post(Stripehandler);
// router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router.get("/allcategory/", getAllCategories);
router.get("/allcategory/:cat", getCategories);
router.route("/:id/reviews").post(protect, createProductReview);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;
