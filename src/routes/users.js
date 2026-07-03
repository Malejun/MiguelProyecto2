import express from "express";
import { getProfile, getUsers } from "../controllers/users.js";
import authorizer from "../middlewares/authorizer.js";
import adminer from "../middlewares/adminer.js";

const router = express.Router();

router.get("/", authorizer, adminer, getUsers);
router.get("/profile", authorizer, getProfile);

export default router;
