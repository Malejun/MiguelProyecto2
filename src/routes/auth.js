import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import checker from "../middlewares/checker.js";
import authorizer from "../middlewares/authorizer.js";

const router = express.Router();

const registerCheck = checker("username", "email", "password");
const loginCheck = checker("email", "password");

router.post("/register", registerCheck, register);
router.post("/login", loginCheck, login);
router.post("/logout", authorizer, logout);

export default router;
