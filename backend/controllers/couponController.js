const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");
const calculateCouponDiscount = require("../utils/calculateCouponDiscount");

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart?.items.length) {
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

    const orderAmount = cart.items.reduce((total, item) => {
      if (!item.product) return total;
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
    const { coupon, discountAmount, finalAmount } =
      await calculateCouponDiscount(req.body.code, orderAmount);

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
