import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";

process.env.JWT_SECRET = "test-secret";

jest.unstable_mockModule("../services/cart.js", () => ({
  addItemToCart: jest.fn(),
  removeItemFromCart: jest.fn(),
  selectUserCart: jest.fn(),
  checkoutCart: jest.fn(),
}));

const { default: app } = await import("../app.js");
const { addItemToCart, removeItemFromCart, selectUserCart, checkoutCart } = await import("../services/cart.js");
const { sign } = await import("../utils/jwt.js");

const authToken = sign({ id: "user-1", email: "test@example.com", role: "user" });
const authCookie = `access_token=${authToken}`;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Cart routes", () => {
  // Obtiene el carrito activo del usuario autenticado.
  test("GET /cart devuelve carrito del usuario autenticado", async () => {
    selectUserCart.mockResolvedValue({ ok: true, content: { userId: "user-1", items: [] } });

    const res = await request(app).get("/cart").set("Cookie", [authCookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, data: { userId: "user-1", items: [] } });
    expect(selectUserCart).toHaveBeenCalledWith("user-1");
  });

  // Agrega un producto al carrito y espera el payload correcto desde el servicio.
  test("POST /cart/items agrega un item al carrito", async () => {
    addItemToCart.mockResolvedValue({ ok: true, content: { userId: "user-1", items: [{ productId: "p1", quantity: 1 }] } });

    const res = await request(app)
      .post("/cart/items")
      .set("Cookie", [authCookie])
      .send({ productId: "p1", quantity: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, data: { userId: "user-1", items: [{ productId: "p1", quantity: 1 }] } });
    expect(addItemToCart).toHaveBeenCalledWith("user-1", { productId: "p1", quantity: 1 });
  });

  // Elimina un item del carrito y verifica la respuesta esperada.
  test("DELETE /cart/items/:itemId elimina un item del carrito", async () => {
    removeItemFromCart.mockResolvedValue({ ok: true, content: { userId: "user-1", items: [] } });

    const res = await request(app).delete("/cart/items/p1").set("Cookie", [authCookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, data: { userId: "user-1", items: [] } });
    expect(removeItemFromCart).toHaveBeenCalledWith("user-1", "p1");
  });

  // Realiza el checkout del carrito y espera un resultado exitoso.
  test("POST /cart/checkout devuelve un checkout exitoso", async () => {
    checkoutCart.mockResolvedValue({ ok: true, content: { userId: "user-1", orderId: "o1", status: "PENDING", items: [{ productId: "p1", quantity: 1 }], cartStatus: "CHECKED_OUT" } });

    const res = await request(app).post("/cart/checkout").set("Cookie", [authCookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, data: { userId: "user-1", orderId: "o1", status: "PENDING", items: [{ productId: "p1", quantity: 1 }], cartStatus: "CHECKED_OUT" } });
    expect(checkoutCart).toHaveBeenCalledWith("user-1");
  });

  // Simula un checkout fallido cuando el carrito está vacío.
  test("POST /cart/checkout maneja carrito vacío con 400", async () => {
    checkoutCart.mockResolvedValue({ ok: false, content: { success: false, message: "cart is empty" } });

    const res = await request(app).post("/cart/checkout").set("Cookie", [authCookie]);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ success: false, message: "cart is empty" });
    expect(checkoutCart).toHaveBeenCalledWith("user-1");
  });
});
