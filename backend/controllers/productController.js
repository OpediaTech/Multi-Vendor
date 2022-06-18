const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc Fetch all products
// @route GET /api/products/
// @access Public.
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single product
// @route GET /api/products/:id
// @access Public.
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Fetch all category
// @route   GET /api/products/allcategory/
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  const allcategories = [];

  products.map((i) => allcategories.push(i.category));
  res.json(allcategories);
});

// @desc    Fetch all category
// @route   GET /api/products/allcategory/:id
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  // const productCategory = await Product.findById(req.params.cat);
  console.log(req.params.cat);

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ category: `${req.params.cat}` })

    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Delete a single product
// @route DELETE /api/products/:id
// @access Private/Admin.
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create product
// @route POST /api/products/
// @access Private/Admin.
const createProduct = asyncHandler(async (req, res) => {
  console.log("req Body", req.body);

  const {
    name,
    // id,
    user,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  } = req.body;

  // const product = new Product({
  //   name: name,
  //   price: 0,
  //   user: user,
  //   image: image,
  //   brand: brand,
  //   category: category,
  //   countInStock: countInStock,
  //   numReviews: numReviews,
  //   description: description,
  // });

  const product = new Product({
    name: "Dihan abir",
    price: 0,
    user: "628f4ed8f4a85a37a8860e01",
    image: ["/images/sample.jpg", "/images/sample.jpg", "/images/sample.jpg"],
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
  });

  const createProduct = await product.save();

  res.status(201).json(createProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin.
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create new review
// @route POST /api/products/:id/review
// @access Private/
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review Added",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Get top rated product
// @route GET /api/products/top
// @access Public/
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
  getCategories,
  getAllCategories,
};
