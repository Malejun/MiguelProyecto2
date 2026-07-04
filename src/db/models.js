import { Schema, model } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

wishlistSchema.index(
  {
    userId: 1,
    productId: 1,
  },
  {
    unique: true,
  },
);

const reviewSchema = new Schema(
  {
    productId: { type: String, required: true }, // Se relaciona con el :id de tu ruta
    userId: { type: String, required: true },    // El usuario que deja la reseña
    comment: { type: String, required: true },  // El texto de la reseña (opcional)
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

reviewSchema.index(
  {
    userId: 1,
    productId: 1,
  },
  {
    unique: true,
  }
);


const cartItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
}, { _id: true });

const cartSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    status: { type: String, enum: ["ACTIVE", "CHECKED_OUT"], default: "ACTIVE" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    items: { type: [cartItemSchema], default: [] },
    status: { type: String, default: "PENDING" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Wishlist = model("Wishlist", wishlistSchema);
export const Review = model("Review", reviewSchema);
export const Cart = model("Cart", cartSchema);
export const Order = model("Order", orderSchema);
