// const express = require("express");

// const {
//   createProduct,
//   getProducts,
//   getProductCategories,
//   getProductById,
//   addProductReview,
//   updateProduct,
//   deleteProduct,
//   getSearchSuggestions,
//   compareProducts,
// } = require("../controllers/productController");

// const { protect, authorize } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.get("/", getProducts);
// router.get("/categories", getProductCategories);
// router.get("/search/suggestions", getSearchSuggestions);
// router.post("/compare", compareProducts);
// router.get("/:id", getProductById);

// router.post("/", protect, authorize("admin", "manager"), createProduct);
// router.put("/:id", protect, authorize("admin", "manager"), updateProduct);
// router.delete("/:id", protect, authorize("admin", "manager"), deleteProduct);

// router.post("/:id/review", protect, addProductReview);

// module.exports = router;


const express = require("express");

const {
  createProduct,
  getProducts,
  getProductCategories,
  getProductById,
  addProductReview,
  updateProduct,
  deleteProduct,
  getSearchSuggestions,
  compareProducts,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getProductCategories);
router.get("/search/suggestions", getSearchSuggestions);
router.post("/compare", compareProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  upload.single("image"),
  updateProduct
);

router.delete("/:id", protect, authorize("admin", "manager"), deleteProduct);

router.post("/:id/review", protect, addProductReview);

module.exports = router;
