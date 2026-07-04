import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import errorHandler from "./middlewares/errorHandler.js";
import { Selector } from "./misc/errors.js";

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import usersRoutes from "./routes/users.js";
import wishlistsRoutes from "./routes/wishlists.js";
import reviewsRoutes from "./routes/reviews.js";
import cartRoutes from "./routes/cart.js";

import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors())

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/wishlist", wishlistsRoutes);
app.use("/review", reviewsRoutes);
app.use("/cart", cartRoutes);

app.get("/health", (req,res)=>{
  res.json({status:"ok"})
})

app.use((_, __, next) => {
  return next(Selector.NOT_FOUND);
});

app.use(errorHandler, ({ statusCode = 500, message }, _, res, __) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;
