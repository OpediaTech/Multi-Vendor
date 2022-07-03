const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");

// @desc Create new order
// @route POST /api/orders
// @access Private
const addAddress = asyncHandler(async (req, res) => {
  const { country, city, street, house } = req.body;

  const address = new Address({
    user: req.user._id,
    country,
    city,
    street,
    house,
  });

  const createdAddress = await address.save();
  res.status(201).json(createdAddress);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getAddress = asyncHandler(async (req, res) => {
  const orders = await Address.find({});

  if (!orders) {
    res.status(200);
    throw new Error("Order list is empty..");
  }
  res.json({ ListS: orders });
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getAddressById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

// @desc Update order to paid
// @route GET /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});
// @desc Update order to delivered
// @route GET /api/orders/:id/deliver
// @access Private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

// @desc Get logged in user orders
// @route GET /api/orders/myordres
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    res.status(200);
    throw new Error("My order list is empty");
  }

  res.json(order);
});

module.exports = {
  addAddress,
  getAddressById,
  updateOrderToPaid,
  getMyOrders,
  getAddress,
  updateOrderToDelivered,
};
