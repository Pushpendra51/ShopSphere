const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const bestSellingProducts = await Product.find()
      .sort({ soldCount: -1 })
      .limit(5);

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } });

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        bestSellingProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
