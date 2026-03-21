import request from "supertest";
import app from "../setup/app";

describe("AUTH ROUTES", () => {
  const user = {
    name: "John",
    lastName: "Smith",
    role: "user",
    email: "john.smith@addressdashboard.com",
    password: "123456789",
    passwordConfirmation: "123456789"
  };

  it("POST /api/v1/auth/register => should display input validation errors", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(4);

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
    expect(res.body.errors).not.toHaveLength(2);
  });

  it("POST /api/v1/auth/register => should return a 409 response for a duplicated email", async () => {
    // Create o register an user first
    await request(app).post("/api/v1/auth/register").send(user);

    const res = await request(app).post("/api/v1/auth/register").send(user);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/auth/register => should return a 201 response for a new created user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "James",
      lastName: "Doe",
      email: "james.doe@addressdashboard.com",
      password: "123456789",
      passwordConfirmation: "123456789"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(409);
    expect(res.body).not.toHaveProperty("error");
  });

  it("POST /api/v1/auth/login => should display input validation errors", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(2);

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("token");
    expect(res.body.errors).not.toHaveLength(4);
  });

  it("POST /api/v1/auth/login => should return a 404 response for a non-existent user", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "not.exists@example.com",
      password: "123456"
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("token");
  });

  it("POST /api/v1/auth/login => should return a 401 response for an incorrect user password", async () => {
    // Create o register an user first
    await request(app).post("/api/v1/auth/register").send(user);

    const res = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: "incorrectPassword"
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("token");
  });

  it("POST /api/v1/auth/login => should login user and return token to the client", async () => {
    // Create o register an user first
    await request(app).post("/api/v1/auth/register").send(user);

    const res = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(401);
    expect(res.body).not.toHaveProperty("error");
  });

  it("GET /api/v1/auth/user => should return authenticated user", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/v1/auth/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("_id");

    expect(res.status).not.toBe(401);
    expect(res.body).not.toHaveProperty("error");
    expect(res.body.data).not.toHaveProperty("password");
  });
});
