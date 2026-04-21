import request from "supertest";
import app from "../setup/app";
import User from "../../models/user.model";
import { hashPassword } from "../../utils/auth";

describe("AUTH CONTROLLER", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    jest.restoreAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test",
        lastName: "User",
        email: "test@test.com",
        password: "123456789",
        passwordConfirmation: "123456789"
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        "Cuenta creada correctamente, ya puedes iniciar sesión"
      );
    });

    it("should return 409 if email already exists", async () => {
      await User.create({
        name: "Test",
        lastName: "User",
        email: "test@test.com",
        password: await hashPassword("123456789")
      });

      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test",
        lastName: "User",
        email: "test@test.com",
        password: "123456789",
        passwordConfirmation: "123456789"
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("El email ingresado ya está en uso por otro Usuario");
    });

    it("should return a 500 response if an error occurs", async () => {
      jest.spyOn(User, "findOne").mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test",
        lastName: "User",
        email: "test@test.com",
        password: "123456789",
        passwordConfirmation: "123456789"
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Error al registrar el usuario");
    });
  });

  describe("login", () => {
    it("should login successfully and return a token", async () => {
      await User.create({
        name: "Test",
        lastName: "User",
        email: "test@test.com",
        password: await hashPassword("123456789")
      });

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
        password: "123456789"
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return a 404 response if user does not exist", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "notfound@test.com",
        password: "123456789"
      });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Usuario no encontrado");
    });

    it("should return a 401 response if password is incorrect", async () => {
      await User.create({
        name: "Test",
        lastName: "User",
        email: "test@test.com",
        password: await hashPassword("123456789")
      });

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
        password: "wrongpassword"
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Contraseña incorrecta");
    });

    it("should return 500 if an error occurs", async () => {
      jest.spyOn(User, "findOne").mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
        password: "123456789"
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Error al iniciar sesión");
    });
  });

  describe("getAuthenticatedUser", () => {
    it("should return authenticated user", async () => {
      await User.create({
        name: "Test",
        lastName: "User",
        email: "test@test.com",
        password: await hashPassword("123456789")
      });

      // Login user and get token
      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
        password: "123456789"
      });

      const token = loginRes.body.token;

      const res = await request(app)
        .get("/api/v1/auth/user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.email).toBe("test@test.com");
    });
  });
});
