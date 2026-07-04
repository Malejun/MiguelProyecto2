import { Review } from "../db/models.js";
import Error, { Selector } from "../misc/errors.js";
import { selectAllProducts } from "./products.js";
import { catcher, isString } from "../utils/common.js";

const saveIntoReview = async (userId, productId, comment) => {
  
    await Review.create({ userId, productId, comment });
   
};

const selectAllReviews = async (productId) => {
    console.log(productId);
    const result = await Review.find(
      { productId },
      {userId: true, comment: true, _id: false },
    );
    
    return {
      ok: true,
      content: result,
    };
  
};

const wrappedSaveIntoReview= catcher(saveIntoReview);
const wrappedSelectReviews = catcher(selectAllReviews, { exceptionCase: [] });

export {
  wrappedSaveIntoReview as saveIntoReview,
  wrappedSelectReviews as selectAllReviews,  
};
