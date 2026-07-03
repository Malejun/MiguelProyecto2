import express from "express";
import {  createProduct, listAllProducts , updateProduct , deleteProduct  } from "../controllers/products.js";
import authorizer from "../middlewares/authorizer.js";
import checker from "../middlewares/checker.js";

const router = express.Router();

const productsCheck = checker("name", "year");
router.post("/", authorizer, productsCheck, createProduct);
router.put("/:productId", authorizer, productsCheck, updateProduct);
router.get("/", listAllProducts);
router.get("/:productId", listAllProducts);
router.delete("/:productId", authorizer, deleteProduct);

export default router;
