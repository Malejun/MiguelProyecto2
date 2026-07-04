import express from "express";
import { addReview , listReviews } from "../controllers/reviews.js";
import authorizer from "../middlewares/authorizer.js";

const router = express.Router();

router.post("/:productId", authorizer, addReview);
router.get("/:productId", authorizer, listReviews);

export default router;