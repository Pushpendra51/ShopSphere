const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getMyOrders);
router.get("/admin", protect, authorize("admin", "manager"), getAllOrders);
router.get("/:id", protect, getOrderById);

router.put(
  "/:id/status",
  protect,
  authorize("admin", "manager"),
  updateOrderStatus
);

module.exports = router;
