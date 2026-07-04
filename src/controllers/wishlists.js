import { Selector } from "../misc/errors.js";
import {
  removeFromWishlist,
  saveIntoWishlist,
  selectAllWishes,
} from "../services/wishlists.js";

export const addWish = async (req, res, next) => {
  const { productId } = req.params;
  const { id } = res.locals;
 
  const result = await saveIntoWishlist(id, productId);

  if (!result.ok) return next(Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
  });
};

export const deleteWish = async (req, res, next) => {
  const { productId } = req.params;
  const { id } = res.locals;

  const result = await removeFromWishlist(id, productId);

  if (!result.ok) return next(result.errorType || Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};

export const listWishes = async (req, res, next) => {
  const { id } = res.locals;

  const result = await selectAllWishes(id);

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};
