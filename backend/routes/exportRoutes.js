const express = require("express");

const { exportSalesReport } = require("../controllers/exportController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/sales-report",
  protect,
  authorize("admin", "manager"),
  exportSalesReport
);

module.exports = router;
