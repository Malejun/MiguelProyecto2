import { prisma } from "../db/config.js";
import { catcher, isString } from "../utils/common.js";

const selectAllProducts = async (productsIds) => {
  return await prisma.product.findMany({
    omit: { createdAt: true, updatedAt: true },
    where: { id: { in: productsIds } },
  });
};

const insertProduct = async ({ year, ...rest }) => {
  const newProduct = { year: isString(year), ...rest };
  await prisma.product.create({ data: newProduct });
};

const updateProductDB = async (productId, { year, ...rest }) => {  
    const updatedData = { year: isString(year), ...rest };    
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
