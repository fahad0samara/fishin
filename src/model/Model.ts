import mongoose from "mongoose";

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profileImage: {type: String, default: "default-avatar.png"},
  wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
  orders: [{type: mongoose.Schema.Types.ObjectId, ref: "Order"}],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  imageUrl: {type: String},
});

// Size Schema
// const SIZE_VALUES = ["S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL", "6XL", "7XL"];

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // enum: SIZE_VALUES,
  },
});

// Color Schema
// const COLOR_VALUES = [
//   "Red",
//   "Green",
//   "Blue",
//   "Yellow",
//   "Purple",
//   "Orange",
//   "Pink",
//   "Black",
//   "White",
//   "Gray",
//   "Brown",
//   "Cyan",
//   "Magenta",
//   "Lavender",
//   "Lime",
//   "Teal",
//   "Olive",
//   "Maroon",
//   "Indigo",
//   "Turquoise",
//   "Silver",
//   "Gold",
//   "Navy",
//   "Violet",
//   "Beige",
//   "Mint",
//   "Coral",
//   "Salmon",
//   "Periwinkle",
//   "Plum",
// ];

const colorSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    // enum: COLOR_VALUES,
  },
  name: {
    type: String,
    // enum: COLOR_VALUES,
  },
});

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
  description: {type: String, required: true},
  images: [{type: String}], // Store image URLs
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}],
  brand: {type: String, required: true},
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
  
  sizes: [{type: mongoose.Schema.Types.ObjectId, ref: "Size"}],
  availability: {type: Boolean, default: true},
});

// Define Review Schema
const reviewSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
  rating: {type: Number, required: true},
  comment: {type: String},
  date: {type: Date, default: Date.now},
});

// Define Order Schema
const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  products: [
    {
      product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
      quantity: {type: Number, required: true},
    },
  ],
  totalPrice: {type: Number, required: true},
  orderDate: {type: Date, default: Date.now},
  shippingAddress: {type: String},
  paymentMethod: {type: String},
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending",
  },
});

// Define Cart Item Schema

const cartItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
  quantity: {type: Number, required: true},
});

// Define Cart Schema
const cartSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  items: [cartItemSchema],
});

// Define Models
const Category = mongoose.model("Category", categorySchema);
const Color = mongoose.model("Color", colorSchema);
const Size = mongoose.model("Size", sizeSchema);
const Product = mongoose.model("Product", productSchema);
const Review = mongoose.model("Review", reviewSchema);
const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);
const CartItem = mongoose.model("CartItem", cartItemSchema);
const Cart = mongoose.model("Cart", cartSchema);

// Export Models
export {Category, Color, Size, Product, Review, User, Order, CartItem, Cart};
