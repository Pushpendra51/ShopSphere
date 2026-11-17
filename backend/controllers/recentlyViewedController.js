const RecentlyViewed = require("../models/RecentlyViewed");
const Product = require("../models/Product");

exports.addRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let history = await RecentlyViewed.findOne({ user: req.user._id });

    if (!history) {
      history = await RecentlyViewed.create({
        user: req.user._id,
        products: [{ product: productId }],
      });
    } else {
      history.products = history.products.filter(
        (item) => item.product.toString() !== productId
      );

      history.products.unshift({
        product: productId,
        viewedAt: new Date(),
      });

      history.products = history.products.slice(0, 10);

      await history.save();
    }

    const updatedHistory = await RecentlyViewed.findOne({
      user: req.user._id,
    }).populate("products.product");

    res.status(200).json({
      success: true,
      message: "Recently viewed product saved",
      recentlyViewed: updatedHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentlyViewed = async (req, res) => {
  try {
    const history = await RecentlyViewed.findOne({
      user: req.user._id,
    }).populate("products.product");

    res.status(200).json({
      success: true,
      recentlyViewed: history || { products: [] },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
