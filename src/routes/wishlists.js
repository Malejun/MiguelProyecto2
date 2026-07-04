import express from "express";
import { addWish, deleteWish, listWishes } from "../controllers/wishlists.js";
import authorizer from "../middlewares/authorizer.js";

const router = express.Router();

router.post("/:productId", authorizer, addWish);
router.get("/", authorizer, listWishes);
router.delete("/:productId", authorizer, deleteWish);

export default router;
