const express = require("express");

const {
  createCoupon,
  validateCoupon,
} = require("../controllers/couponController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "manager"), createCoupon);
router.post("/validate", protect, validateCoupon);

module.exports = router;
