const express = require("express");
const router = express.Router();

const {
  getStoreById,
  addStore,
  getStore,
} = require("../controllers/storeController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(addStore).get(getStore);
router.route("/:id").get(getStoreById);
// router.route("/myorders").get(protect, getMyOrders);
// router.route('/:id/pay').put(protect, updateOrderToPaid)
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
