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


export const Wishlist = model("Wishlist", wishlistSchema);
export const Review = model("Review", reviewSchema);
