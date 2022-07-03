const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    country: { type: String, required: false },
    city: { type: String, required: false },
    street: { type: String, required: false },
    house: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
