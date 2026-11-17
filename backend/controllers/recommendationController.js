const Product = require("../models/Product");
const RecentlyViewed = require("../models/RecentlyViewed");

exports.getRecommendations = async (req, res) => {
  try {
    const history = await RecentlyViewed.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    let categories = [];
    let tags = [];

    if (history && history.products.length > 0) {
      history.products.forEach((item) => {
        if (item.product) {
          categories.push(item.product.category);
          tags.push(...item.product.tags);
        }
      });
    }

    const recommendations = await Product.find({
      $or: [
        { category: { $in: categories } },
        { tags: { $in: tags } },
        { rating: { $gte: 4 } },
        { soldCount: { $gte: 1 } },
      ],
    }).limit(10);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
