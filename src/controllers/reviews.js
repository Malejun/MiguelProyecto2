import { Selector } from "../misc/errors.js";
import {  
  saveIntoReview,
  selectAllReviews,
} from "../services/reviews.js";

export const addReview = async (req, res, next) => {

  const { productId } = req.params;
  const { comment } = req.body;
  const { id } = res.locals;

  const result = await saveIntoReview(id, productId, comment);

  if (!result.ok) return next(Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
  });
};

export const listReviews = async (req, res, next) => {
  const { productId } = req.params;
  
  const result = await selectAllReviews(productId);
  return res.status(200).json({
    success: true,
    data: result.content,
  });
};
