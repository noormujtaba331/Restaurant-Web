const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, "Food name is required"],
    trim: true,
  },
  foodImage: {
    type: String,
    required: [true, "Food image URL is required"],
  },
  foodPrice: {
    type: Number,
    required: [true, "Food price is required"],
  },
  size: {
    type: String,
    required: false, // Ab size optional hai, agar request me aayega tabhi save hoga
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity cannot be less than 1"],
  },
  subtotal: {
    type: Number,
    required: [true, "Item subtotal is required"],
  },
});

// 2. Customer Sub-Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Customer phone number is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Delivery address is required"],
    trim: true,
  },
});

// 3. Billing Sub-Schema
const billingSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true,
  },
  delivery: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

// 4. Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    customer: {
      type: customerSchema,
      required: true,
    },
    billing: {
      type: billingSchema,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    cancelReason: {
    type: String,
    default: ""
  }
  },
  {
    timestamps: true,
  }
);

const Order_Model = mongoose.model("Order", orderSchema);

module.exports = Order_Model;
