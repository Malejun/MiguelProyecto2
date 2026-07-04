import { prisma } from "../db/config.js";
import { catcher, isString } from "../utils/common.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

const normalizeProductPayload = ({ year, price, imageFile, ...rest }) => ({
  year: isString(year),
  price: price === undefined || price === null ? null : Number(price),
  ...rest,
});

const selectAllProducts = async (productsIds) => {
  return await prisma.product.findMany({
    omit: { createdAt: true, updatedAt: true },
    where: { id: { in: productsIds } },
  });
};

const insertProduct = async (payload) => {
  const { imageFile, ...rest } = payload;
  const newProduct = normalizeProductPayload(rest);

  if (imageFile) {
    const uploadedImage = await uploadImageToCloudinary(imageFile);
    newProduct.imageUrl = uploadedImage.secure_url;
  }

  await prisma.product.create({ data: newProduct });
};

const updateProductDB = async (productId, payload) => {  
    const { imageFile, ...rest } = payload;
    const updatedData = normalizeProductPayload(rest);    

    if (imageFile) {
      const uploadedImage = await uploadImageToCloudinary(imageFile);
      updatedData.imageUrl = uploadedImage.secure_url;
    }

    await prisma.product.update({
      where: { id: productId },
      data: updatedData
    });  
};

const deleteProductDB = async (productId) => {  
    await prisma.product.delete({
      where: { id: productId }
    });  
};




const wrappedInsertProduct = catcher(insertProduct);
const wrappedSelectProducts = catcher(selectAllProducts, { exceptionCase: [] });
const wrappedUpdateProduct = catcher(updateProductDB, { exceptionCase: [] });
const wrappedDeleteProduct = catcher(deleteProductDB, { exceptionCase: [] });

export {
  wrappedInsertProduct as insertProduct,
  wrappedSelectProducts as selectAllProducts,
  wrappedUpdateProduct as updateProductDB,
  wrappedDeleteProduct as deleteProductDB,
};
