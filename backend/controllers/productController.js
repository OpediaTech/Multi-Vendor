const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const stripe = require("stripe")(
  "sk_test_51L2pj4JsstQNEHZrVKGXwGV2lLAGBGUMmkDla3oHx1oWqgLPW7CmUEtShbiBpAzRquDoMHlHRQmPrLjCetKrpzk000hIULFMI7"
);



const { v4: uuid } = require("uuid");
const { strip } = require("colors");
const e = require("express");
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

// @desc Fetch a single product
// @route GET /api/products/search/:search
// @access Public.
const getSearchProducts = asyncHandler(async (req, res) => {
  const searchKey = req.params.search.toLowerCase();
  console.log(searchKey);
  const product = await Product.find({});

  // var text = "Airpods Wireless Bluetooth Headphones";
  // var resu = text.includes("Airpods");
  // console.log(resu);
  // const allSearchedProducts = product.filter((i) => console.log(typeof i.name));
  const allSearchedProducts = product.filter((i) => {
    const mainname = i.name.toLowerCase();
    return mainname.includes(searchKey) && i;
  });
  console.log(allSearchedProducts);

  if (product) {
    res.status(200).json({ total: product.length, allSearchedProducts });
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
    store,
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
    name: "Dihan abir okay",
    price: 0,
    user: "628f4ed8f4a85a37a8860e01",
    image:
      "https://images.unsplash.com/photo-1631880383152-f29099b0fd16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=887&q=80",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
    store: "62d0fd23661bd648f8782694",
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

// stripe section


// const Stripehandler = asyncHandler(async (req, res) => {
//   const { product, token } = req.body;
//   const implementedKey = uuid();

//   // console.log("dalwat mia", req.body);
//   console.log("token.email", product?.price);
//   console.log("token.productby", product?.productby);
//   console.log("token.productby prddd", product);

//   await stripe.customers
//     .create({
//       email: token?.email,
//       source: token?.id,
//     })
//     .then(async (customer) => {
//       await stripe.charges.create({
//         amount: product?.price * 100,
//         currency: "usd",
//         customer: customer.id,
//         description: `Product charge for ${product?.name}`,
//         shipping: {
//           name: token?.card.name,
//           address: {
//             country: token?.card.address_country,
//           },
//         },
//       });
//     })
//     .then((result) => {
//       res.status(200).json(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });


const Stripehandler = asyncHandler(async (req, res) => {
    const {product} = req.body
    console.log("Prdt",product)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: 
        [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product?.name
              },
              unit_amount: product?.price
            },
            quantity: 1,
          }
        ],
        success_url: 'https://name-flame.vercel.app/Thanks',
        // success_url: 'https://name-flame.vercel.app/',
        cancel_url: 'https://name-flame.vercel.app/'
   
    })
    console.log(session)
    console.log(session.url)
    res.json({url: session.url});
    
  } catch (e) {
    res.status(500).json({error:e.message})
  }


})


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
  Stripehandler,
  getSearchProducts,
};
