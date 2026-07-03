import { Selector } from "../misc/errors.js";
import { insertProduct, selectAllProducts , updateProductDB , deleteProductDB } from "../services/products.js";

export const createProduct = async (req, res, next) => {
  const { name, brand, year, rating } = req.body;
  const result = await insertProduct({ name, brand, year, rating });

  if (!result.ok) return next(Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
  });
};

export const listAllProducts = async (req, res, next) => { 
  
  const { productId } = req.params;
    
    let result;
    
    if (productId) {      
      result = await selectAllProducts([productId]); // Búsqueda específica
    } else {
      result = await selectAllProducts(); // Búsqueda general
    }

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { name, brand, year, rating } = req.body;
  const result = await updateProductDB(productId, { name, brand, year, rating });

  if (!result.ok) return next(Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
  });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const result = await deleteProductDB(productId);

  if (!result.ok) return next(Selector.BAD_ERROR);

  return res.status(200).json({
    success: true,
  });
};
