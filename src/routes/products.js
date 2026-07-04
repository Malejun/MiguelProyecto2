import express from "express";
import multer from "multer";
import {  createProduct, listAllProducts , updateProduct , deleteProduct  } from "../controllers/products.js";
import authorizer from "../middlewares/authorizer.js";
import checker from "../middlewares/checker.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const productsCheck = checker("name");
router.post("/", authorizer, upload.single("image"), productsCheck, createProduct);
router.put("/:productId", authorizer, upload.single("image"), productsCheck, updateProduct);
router.get("/", listAllProducts);
router.get("/:productId", listAllProducts);
router.delete("/:productId", authorizer, deleteProduct);

export default router;

