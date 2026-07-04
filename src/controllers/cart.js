import { Selector } from "../misc/errors.js";
import { addItemToCart, checkoutCart, removeItemFromCart, selectUserCart } from "../services/cart.js";

export const listCart = async (req, res, next) => {
  const { id } = res.locals;
  const result = await selectUserCart(id);

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};

export const addCartItem = async (req, res, next) => {
  const { id } = res.locals;
  const payload = req.body;
  const result = await addItemToCart(id, payload);

  if (!result.ok) return next(Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};

export const deleteCartItem = async (req, res, next) => {
  const { id } = res.locals;
  const { itemId } = req.params;
  const result = await removeItemFromCart(id, itemId);

  if (!result.ok) return next(Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};

export const checkout = async (req, res, next) => {
  const { id } = res.locals;
  const result = await checkoutCart(id);

  if (!result.ok) {
    return res.status(400).json({
      success: false,
      message: result.content?.message || "cart is empty",
    });
  }

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};
