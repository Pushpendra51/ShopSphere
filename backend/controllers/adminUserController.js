const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role phone createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};