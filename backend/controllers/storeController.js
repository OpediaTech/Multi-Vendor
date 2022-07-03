const asyncHandler = require("express-async-handler");
const Store = require("../models/storeModel");

// @desc Create new order
// @route POST /api/orders
// @access Private
const addStore = asyncHandler(async (req, res) => {
  const { owner, name, image, description, address } = req.body;

  const store = new Store({
    // owner: owner ? owner : req.user._id,
    owner,
    name,
    image,
    description,
    address,
  });

  const createdStore = await store.save();
  res.status(201).json(createdStore);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getStore = asyncHandler(async (req, res) => {
  const store = await Store.find({});

  if (!store) {
    res.status(200);
    throw new Error("Order list is empty..");
  }
  res.json({ ListS: store });
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (store) {
    res.json(store);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

module.exports = {
  addStore,
  getStore,
  getStoreById,
};
