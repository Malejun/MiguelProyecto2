import { Cart, Order } from "../db/models.js";
import { catcher } from "../utils/common.js";


// Devuelve el payload del carrito con solo la información necesaria para
// identificar cada producto y su cantidad.
const getCartItemsPayload = async (userId, items) => ({
  userId,
  items: items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  })),
});

// Obtiene el carrito completo del usuario autenticado. Si no existe, devuelve
// un carrito vacío con el mismo formato que la respuesta normal.
const selectUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId, status: "ACTIVE" });

  if (!cart) {
    return { userId, items: [] };
  }

  return await getCartItemsPayload(userId, cart.items);
};

// Normaliza la información del producto que llega en el body para asegurar que siempre tenga un formato válido antes de guardarlo en Mongo.
export const normalizeCartItemInput = ({ productId, quantity = 1 }) => ({
  productId,
  quantity: Number(quantity) || 1,
});

// Agrega un producto al carrito del usuario. Si ya existe en el carrito, incrementa la cantidad; si no, crea un nuevo ítem.
const addItemToCart = async (userId, payload) => {
  const normalizedItem = normalizeCartItemInput(payload);
  let cart = await Cart.findOne({ userId, status: "ACTIVE" });

  if (!cart) {
    cart = await Cart.create({ userId, items: [normalizedItem], status: "ACTIVE" });
    return await getCartItemsPayload(userId, cart.items);
  }

  const existingItem = cart.items.find((item) => item.productId === normalizedItem.productId);

  if (existingItem) {
    existingItem.quantity += normalizedItem.quantity;
  } else {
    cart.items.push(normalizedItem);
  }

  await cart.save();

  return await getCartItemsPayload(userId, cart.items);
};

// Elimina un producto del carrito. Si la cantidad es mayor a 1, la reduce en
// uno; si es 1, lo quita por completo. Acepta el productId que llega en la ruta.
const removeItemFromCart = async (userId, itemId) => {
  const cart = await Cart.findOne({ userId, status: "ACTIVE" });

  if (!cart) {
    return { userId, items: [] };
  }

  const itemIndex = cart.items.findIndex((item) => {
    return item.productId === itemId || item._id.toString() === itemId;
  });

  if (itemIndex === -1) {
    return { userId, items: [] };
  }

  const targetItem = cart.items[itemIndex];

  if (targetItem.quantity > 1) {
    targetItem.quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1);
  }

  await cart.save();

  return await getCartItemsPayload(userId, cart.items);
};


const checkoutCart = async (userId) => {
  const cart = await Cart.findOne({ userId, status: "ACTIVE" });

  if (!cart || cart.items.length === 0) {
    throw new Error("cart is empty");
  }

  const order = await Order.create({
    userId,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    status: "PENDING",
  });

  cart.status = "CHECKED_OUT";
  cart.items = [];
  await cart.save();

  return {
    userId,
    orderId: order._id.toString(),
    status: order.status,
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    cartStatus: cart.status,
  };
};

const wrappedAddItemToCart = catcher(addItemToCart, { exceptionCase: { userId: "", items: [] } });
const wrappedRemoveItemFromCart = catcher(removeItemFromCart, { exceptionCase: { userId: "", items: [] } });
const wrappedSelectUserCart = catcher(selectUserCart, { exceptionCase: { userId: "", items: [] } });
const wrappedCheckoutCart = catcher(checkoutCart, { exceptionCase: { success: false, message: "cart is empty" } });

export {
  wrappedAddItemToCart as addItemToCart,
  wrappedRemoveItemFromCart as removeItemFromCart,
  wrappedSelectUserCart as selectUserCart,
  wrappedCheckoutCart as checkoutCart,
};
