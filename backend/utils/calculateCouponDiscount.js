const Coupon = require("../models/Coupon");

const calculateCouponDiscount = async (code, orderAmount) => {
  if (!Number.isFinite(orderAmount) || orderAmount < 0) {
    const error = new Error("Invalid order amount");
    error.statusCode = 400;
    throw error;
  }

  const coupon = await Coupon.findOne({
    code: String(code || "").trim().toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    const error = new Error("Invalid coupon");
    error.statusCode = 404;
    throw error;
  }

  if (coupon.expiryDate <= new Date()) {
    const error = new Error("Coupon expired");
    error.statusCode = 400;
    throw error;
  }

  if (orderAmount < coupon.minOrderAmount) {
    const error = new Error(
      `Minimum order amount should be ${coupon.minOrderAmount}`
    );
    error.statusCode = 400;
    throw error;
  }

  const rawDiscount =
    coupon.discountType === "percentage"
      ? (orderAmount * coupon.discountValue) / 100
      : coupon.discountValue;
  const discountAmount = Math.min(orderAmount, rawDiscount);

  return {
    coupon,
    discountAmount: Number(discountAmount.toFixed(2)),
    finalAmount: Number((orderAmount - discountAmount).toFixed(2)),
  };
};

module.exports = calculateCouponDiscount;
