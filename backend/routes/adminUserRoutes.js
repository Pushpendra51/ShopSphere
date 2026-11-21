const express = require("express");

const { getAllUsers } = require("../controllers/adminUserController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUsers);

module.exports = router;