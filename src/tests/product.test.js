import { test, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";

process.env.JWT_SECRET = "test-secret";

jest.unstable_mockModule("../services/products.js", () => ({
  insertProduct: jest.fn(),
  selectAllProducts: jest.fn(),
  updateProductDB: jest.fn(),
  deleteProductDB: jest.fn(),
}));

const { default: app } = await import("../app.js");
const { sign } = await import("../utils/jwt.js");
const { insertProduct, selectAllProducts, updateProductDB, deleteProductDB } = await import("../services/products.js");

const authToken = sign({ id: "user-1", email: "test@example.com", role: "user" });
const authCookie = `access_token=${authToken}`;

beforeEach(() => {
  jest.clearAllMocks();
});

// Comprueba que el endpoint de salud responde correctamente.
test("GET /health devuelve status ok", async () => {
  const res = await request(app).get("/health");
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe("ok");
});

// Lista todos los productos disponibles usando el servicio mockeado.
test("GET /products devuelve lista de productos", async () => {
  selectAllProducts.mockResolvedValue({ ok: true, content: [] });

  const res = await request(app).get("/products");

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true, data: [] });
  expect(selectAllProducts).toHaveBeenCalledWith();
});

// Consulta un producto específico por su ID y verifica el payload devuelto.
test("GET /products/:productId devuelve producto específico", async () => {
  selectAllProducts.mockResolvedValue({ ok: true, content: [{ id: "p1", name: "Producto test", price: 1200 }] });

  const res = await request(app).get("/products/p1");

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true, data: [{ id: "p1", name: "Producto test", price: 1200 }] });
  expect(selectAllProducts).toHaveBeenCalledWith(["p1"]);
});

// Crea un nuevo producto con autenticación mediante cookie JWT.
test("POST /products crea producto", async () => {
  insertProduct.mockResolvedValue({ ok: true, content: {} });

  const res = await request(app)
    .post("/products")
    .set("Cookie", [authCookie])
    .send({
      name: "Producto test",
      price: 1200,
    });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true });
  expect(insertProduct).toHaveBeenCalled();
  expect(insertProduct.mock.calls[0][0]).toMatchObject({ name: "Producto test", price: 1200 });
});

// Actualiza un producto existente y verifica llamada al servicio.
test("PUT /products/:productId actualiza producto", async () => {
  updateProductDB.mockResolvedValue({ ok: true, content: {} });

  const res = await request(app)
    .put("/products/p1")
    .set("Cookie", [authCookie])
    .send({
      name: "Producto actualizado",
      price: 1500,
    });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true });
  expect(updateProductDB).toHaveBeenCalledWith("p1", expect.objectContaining({ name: "Producto actualizado", price: 1500 }));
});

// Elimina un producto por ID usando el servicio mockeado.
test("DELETE /products/:productId elimina producto", async () => {
  deleteProductDB.mockResolvedValue({ ok: true, content: {} });

  const res = await request(app)
    .delete("/products/p1")
    .set("Cookie", [authCookie]);

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true });
  expect(deleteProductDB).toHaveBeenCalledWith("p1");
});
