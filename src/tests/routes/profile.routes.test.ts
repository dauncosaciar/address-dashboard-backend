import request from "supertest";
import app from "../setup/app";

describe("PROFILE ROUTES", () => {
  const user = {
    name: "John",
    lastName: "Smith",
    role: "user",
    email: "john.smith@addressdashboard.com",
    password: "123456789",
    passwordConfirmation: "123456789"
  };

  it("PUT /api/v1/profile => should display input validation errors", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .put("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(3);

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("message");
    expect(res.body.errors).not.toHaveLength(1);
  });

  it("PUT /api/v1/profile => should return a 200 response for a successful profile update", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .put("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John D.",
        lastName: "Smith",
        email: "john.d.smith@addressdashboard.com"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });

  it("PUT /api/v1/profile/password => should display input validation errors", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .put("/api/v1/profile/password")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(2);

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("message");
  });

  it("PUT /api/v1/profile/password => should display not equal validation error for passwords", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .put("/api/v1/profile/password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "123456789",
        newPassword: "987654321",
        newPasswordConfirmation: "000"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("message");
  });

  it("PUT /api/v1/profile/password => should return a 200 response for a successful password update", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .put("/api/v1/profile/password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "123456789",
        newPassword: "987654321",
        newPasswordConfirmation: "987654321"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });
});
