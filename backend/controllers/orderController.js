const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const calculateCouponDiscount = require("../utils/calculateCouponDiscount");

const releaseReservedStock = async (reservations) => {
  while (reservations.length) {
    const reservation = reservations[reservations.length - 1];
    await Product.updateOne(
      { _id: reservation.productId },
      {
        $inc: {
          stock: reservation.quantity,
          soldCount: -reservation.quantity,
        },
      }
    );
    reservations.pop();
  }
};

exports.placeOrder = async (req, res) => {
  const reservedStock = [];
  let createdOrder;

  try {
    const { shippingAddress, paymentMethod } = req.body;
    const paymentMethods = ["Cash on Delivery", "UPI", "Card", "Net Banking"];

    if (
      !shippingAddress ||
      ["fullName", "phone", "street", "city", "state", "pincode"].some(
        (field) => !String(shippingAddress[field] || "").trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping information is required",
      });
    }

    if (!paymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (cart.items.some((item) => !item.product)) {
      return res.status(400).json({
        success: false,
        message: "Cart contains a product that is no longer available",
      });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      category: item.product.category,
      brand: item.product.brand,
      image:
        item.product.images?.[0]?.url ||
        item.product.images?.[0] ||
        item.product.imageUrl ||
        "",
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price,
    }));

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const couponCode = String(req.body.couponCode || "").trim().toUpperCase();
    const couponResult = couponCode
      ? await calculateCouponDiscount(couponCode, subtotal)
      : { discountAmount: 0, finalAmount: subtotal };

    for (const item of cart.items) {
      const update = await Product.updateOne(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } }
      );

      if (update.modifiedCount !== 1) {
        await releaseReservedStock(reservedStock);
        return res.status(400).json({
          success: false,
          message: `${item.product.name} does not have enough stock`,
        });
      }

      reservedStock.push({
        productId: item.product._id,
        quantity: item.quantity,
      });
    }

    createdOrder = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      subtotal,
      discountAmount: couponResult.discountAmount,
      couponCode,
      totalAmount: couponResult.finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
    });

    cart.items = [];
    await cart.save();
    reservedStock.length = 0;

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    if (createdOrder) {
      try {
        await Order.deleteOne({ _id: createdOrder._id });
      } catch (rollbackError) {
        console.error(`Order rollback failed: ${rollbackError.name}`);
      }
    }

    if (reservedStock.length) {
      try {
        await releaseReservedStock(reservedStock);
      } catch (rollbackError) {
        console.error(`Stock rollback failed: ${rollbackError.name}`);
      }
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(req.params.id).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (
      !["admin", "manager"].includes(req.user.role) &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updates = {};

    if (
      orderStatus &&
      !["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    if (paymentStatus && !["Pending", "Paid", "Failed"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "At least one order or payment status is required",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
