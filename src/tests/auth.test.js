import { test, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";

process.env.JWT_SECRET = "test-secret";

jest.unstable_mockModule("../services/auth.js", () => ({
  insertUser: jest.fn(),
  selectUser: jest.fn(),
}));

jest.unstable_mockModule("../services/products.js", () => ({
  insertProduct: jest.fn(),
  selectAllProducts: jest.fn(),
  updateProductDB: jest.fn(),
  deleteProductDB: jest.fn(),
}));

const { default: app } = await import("../app.js");
const { sign } = await import("../utils/jwt.js");
const { insertUser, selectUser } = await import("../services/auth.js");
const { insertProduct, selectAllProducts } = await import("../services/products.js");

const authToken = sign({ id: "user-1", email: "test@example.com", role: "user" });
const authCookie = `access_token=${authToken}`;

beforeEach(() => {
  jest.clearAllMocks();
});

// Registra un usuario nuevo y comprueba que se invoca el servicio con el payload correcto.
test("POST /auth/register registra un usuario", async () => {
  insertUser.mockResolvedValue({ ok: true });

  const payload = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    role: "user",
    bio: "bio test",
  };

  const res = await request(app).post("/auth/register").send(payload);

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true });
  expect(insertUser).toHaveBeenCalledWith(payload);
});

// Hace login y verifica que se retorna una cookie de sesión.
test("POST /auth/login autentica y devuelve cookie", async () => {
  selectUser.mockResolvedValue({ ok: true, content: "token-value" });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "password123" });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true });
  expect(res.headers["set-cookie"]).toBeDefined();
  expect(selectUser).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" });
});

// Cierra sesión usando la cookie JWT y valida la respuesta correcta.
test("POST /auth/logout cierra sesión con cookie válida", async () => {
  const res = await request(app)
    .post("/auth/logout")
    .set("Cookie", [authCookie]);

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ success: true });
});

// Flujo completo de API: registro, login, crear producto y consulta de producto.
test("Flujo completo: registrar, login, crear producto y consultar producto", async () => {
  insertUser.mockResolvedValue({ ok: true });
  selectUser.mockResolvedValue({ ok: true, content: authToken });
  insertProduct.mockResolvedValue({ ok: true, content: {} });
  selectAllProducts.mockResolvedValue({ ok: true, content: [{ id: "p1", name: "Producto flujo", price: 500 }] });

  const registration = await request(app).post("/auth/register").send({
    username: "flowuser",
    email: "flow@example.com",
    password: "password123",
    role: "user",
    bio: "bio flujo",
  });

  expect(registration.statusCode).toBe(200);
  expect(registration.body).toEqual({ success: true });
  expect(insertUser).toHaveBeenCalledWith(expect.objectContaining({ email: "flow@example.com" }));

  const login = await request(app).post("/auth/login").send({
    email: "flow@example.com",
    password: "password123",
  });

  expect(login.statusCode).toBe(200);
  expect(login.body).toEqual({ success: true });
  expect(login.headers["set-cookie"]).toBeDefined();

  const productCreate = await request(app)
    .post("/products")
    .set("Cookie", login.headers["set-cookie"])
    .send({
      name: "Producto flujo",
      price: 500,
    });

  expect(productCreate.statusCode).toBe(200);
  expect(productCreate.body).toEqual({ success: true });
  expect(insertProduct).toHaveBeenCalledWith(expect.objectContaining({ name: "Producto flujo", price: 500 }));

  const productFetch = await request(app)
    .get("/products/p1")
    .set("Cookie", login.headers["set-cookie"]);

  expect(productFetch.statusCode).toBe(200);
  expect(productFetch.body).toEqual({ success: true, data: [{ id: "p1", name: "Producto flujo", price: 500 }] });
  expect(selectAllProducts).toHaveBeenCalledWith(["p1"]);
});
