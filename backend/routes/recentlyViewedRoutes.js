const express = require("express");

const {
  addRecentlyViewed,
  getRecentlyViewed,
} = require("../controllers/recentlyViewedController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addRecentlyViewed);
router.get("/", protect, getRecentlyViewed);

module.exports = router;
