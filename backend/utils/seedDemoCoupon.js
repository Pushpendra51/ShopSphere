const Coupon = require("../models/Coupon");

const seedDemoCoupon = async () => {
  await Coupon.updateOne(
    { code: "WELCOME10" },
    {
      $setOnInsert: {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 0,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    },
    { upsert: true }
  );
};

module.exports = seedDemoCoupon;
