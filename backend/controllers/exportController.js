const Order = require("../models/Order");

exports.exportSalesReport = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name category brand");

    let csv = "Order ID,Customer Name,Customer Email,Product,Category,Brand,Quantity,Price,Total Amount,Payment Status,Order Status,Date\n";

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        csv += `${order._id},${order.user?.name || "N/A"},${order.user?.email || "N/A"},${item.name || item.product?.name || "N/A"},${item.category || item.product?.category || "N/A"},${item.brand || item.product?.brand || "N/A"},${item.quantity},${item.price},${order.totalAmount},${order.paymentStatus},${order.orderStatus},${order.createdAt.toISOString()}\n`;
      });
    });

    res.header("Content-Type", "text/csv");
    res.attachment("shopsphere-sales-report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

