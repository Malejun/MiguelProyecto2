import { Wishlist } from "../db/models.js";
import { catcher } from "../utils/common.js";
import { selectAllProducts } from "./products.js";

const saveIntoWishlist = async (userId, productId) => {
  await Wishlist.create({ userId, productId });
};

const removeFromWishlist = async (userId, productId) => {
  return await Wishlist.findOneAndDelete({ userId, productId });
};

const selectAllWishes = async (userId) => {
  const result = await Wishlist.find(
    { userId },
    { productId: true, _id: false },
  );
  
  const { content } = await selectAllProducts(
    result.map(({ productId }) => productId),
  );

  return content;
};

const wrappedSaveIntoWishlist = catcher(saveIntoWishlist);
const wrappedRemoveFromWishlist = catcher(removeFromWishlist, { exceptionCase: [] });
const wrappedSelectAllWishes = catcher(selectAllWishes, { exceptionCase: [] });

export {
  wrappedSaveIntoWishlist as saveIntoWishlist,
  wrappedRemoveFromWishlist as removeFromWishlist,
  wrappedSelectAllWishes as selectAllWishes,
};
