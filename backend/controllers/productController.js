
const Product = require("../models/Product");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

// Upload image to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "shopsphere/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Upload image if provided
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file);
      productData.images = [uploadedImage];
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    let query = {};

    if (search) {
      const escapedSearch = String(search).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { category: { $regex: escapedSearch, $options: "i" } },
        { brand: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};

      if (minPrice !== undefined) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        query.price.$lte = Number(maxPrice);
      }

      if (
        Object.values(query.price).some(
          (value) => !Number.isFinite(value)
        ) ||
        (query.price.$gte !== undefined &&
          query.price.$lte !== undefined &&
          query.price.$gte > query.price.$lte)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid price range",
        });
      }
    }

    let sortOption = {};

    if (sort === "price-low") sortOption.price = 1;
    if (sort === "price-high") sortOption.price = -1;
    if (sort === "rating") sortOption.rating = -1;
    if (sort === "newest") sortOption.createdAt = -1;
    if (sort === "popular") sortOption.soldCount = -1;

    const products = await Product.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PRODUCT CATEGORIES
exports.getProductCategories = async (req, res) => {
  try {
    const categories = (await Product.distinct("category"))
      .filter(
        (category) =>
          typeof category === "string" && category.trim()
      )
      .sort((left, right) => left.localeCompare(right));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD PRODUCT REVIEW
exports.addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5 ||
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A rating from 1 to 5 and a review comment are required",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (review) =>
        review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: numericRating,
      comment: comment.trim(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (sum, item) => item.rating + sum,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check product before uploading a replacement image
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = { ...req.body };

    // Upload replacement image only when provided
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file);
      updateData.images = [uploadedImage];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SEARCH SUGGESTIONS
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(200).json({
        success: true,
        suggestions: [],
      });
    }

    const escapedKeyword = String(keyword).replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const products = await Product.find({
      name: { $regex: escapedKeyword, $options: "i" },
    })
      .select("name category brand")
      .limit(8);

    res.status(200).json({
      success: true,
      suggestions: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// COMPARE PRODUCTS
exports.compareProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (
      !Array.isArray(ids) ||
      ids.length < 2 ||
      !ids.every((id) => mongoose.isValidObjectId(id))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least two valid product IDs",
      });
    }

    const products = await Product.find({
      _id: { $in: ids },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
