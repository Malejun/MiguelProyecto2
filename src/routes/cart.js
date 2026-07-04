import express from "express";
import { addCartItem, checkout, deleteCartItem, listCart } from "../controllers/cart.js";
import authorizer from "../middlewares/authorizer.js";

const router = express.Router();

router.get("/", authorizer, listCart);
router.post("/items", authorizer, addCartItem);
router.delete("/items/:itemId", authorizer, deleteCartItem);
router.post("/checkout", authorizer, checkout);

export default router;
