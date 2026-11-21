const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDB = require("./config/db");
const seedDemoCoupon = require("./utils/seedDemoCoupon");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const couponRoutes = require("./routes/couponRoutes");
const recentlyViewedRoutes = require("./routes/recentlyViewedRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const exportRoutes = require("./routes/exportRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://shop-sphere-plum.vercel.app",
  "https://shopsphere-mart.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/recently-viewed", recentlyViewedRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/admin/export", exportRoutes);
app.use("/api/admin/users", adminUserRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopSphere API is running successfully",
  });
});

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    if (process.env.JWT_SECRET.length < 32) {
      console.warn("JWT_SECRET should contain at least 32 characters.");
    }

    await connectDB();

    if (process.env.NODE_ENV !== "production") {
      await seedDemoCoupon();
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`ShopSphere backend running on port ${PORT}`);
    });
  } catch {
    console.error(
      "ShopSphere startup failed; check required environment variables and MongoDB availability."
    );
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
