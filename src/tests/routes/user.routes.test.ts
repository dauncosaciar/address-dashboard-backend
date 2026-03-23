import request from "supertest";
import app from "../setup/app";
import User from "../../models/user.model";

describe("USER ROUTES", () => {
  const adminUser = {
    name: "Marcus",
    lastName: "Wright",
    role: "admin",
    email: "marcus.wright@addressdashboard.com",
    password: "123456789",
    passwordConfirmation: "123456789"
  };

  const normalUser = {
    name: "John",
    lastName: "Smith",
    role: "user",
    email: "john.smith@addressdashboard.com",
    password: "123456789",
    passwordConfirmation: "123456789"
  };

  const getAdminToken = async () => {
    // Register an admin user
    await request(app).post("/api/v1/auth/register").send(adminUser);

    // Force role to admin
    const user = await User.findOne({ email: adminUser.email });
    user.role = "admin";
    await user.save();

    // Login the user and get token
    const res = await request(app).post("/api/v1/auth/login").send({
      email: adminUser.email,
      password: adminUser.password
    });

    return res.body.token;
  };

  const getUserToken = async () => {
    // Register a normal user
    await request(app).post("/api/v1/auth/register").send(normalUser);

    // Login the user and get token
    const res = await request(app).post("/api/v1/auth/login").send({
      email: normalUser.email,
      password: normalUser.password
    });

    return res.body.token;
  };

  it("POST /api/v1/users => should return a 403 response if not admin user", async () => {
    const token = await getUserToken();

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users => should display input validation errors", async () => {
    const token = await getAdminToken();

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(5);

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users => should return a 201 response for the creation of a new user", async () => {
    const token = await getAdminToken();

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jane",
        lastName: "Doe",
        role: "user",
        email: "jane.doe@addressdashboard.com",
        password: "123456789"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });

  it("GET /api/v1/users => should return a data property with an array of users", async () => {
    const token = await getAdminToken();

    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
    expect(res.body).not.toHaveProperty("error");
  });

  it("GET /api/v1/users/:userId => should return a 400 response for invalid user ID", async () => {
    const token = await getAdminToken();

    const res = await request(app)
      .get("/api/v1/users/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId => should return a 404 response if user does not exist", async () => {
    const token = await getAdminToken();
    const fakeUserId = "69af242036feaf200a14b371";

    const res = await request(app)
      .get(`/api/v1/users/${fakeUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId => should return a user", async () => {
    const token = await getAdminToken();

    const user = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .get(`/api/v1/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("PUT /api/v1/users/:userId => should display input validation errors", async () => {
    const token = await getAdminToken();

    const user = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "update.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .put(`/api/v1/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");

    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("message");
  });

  it("PUT /api/v1/users/:userId => should return a 200 response for a successful user update", async () => {
    const token = await getAdminToken();

    const user = await User.create({
      name: "Old",
      lastName: "Name",
      role: "user",
      email: "old.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .put(`/api/v1/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "New",
        lastName: "Name",
        role: "user",
        email: "new.user@addressdashboard.com",
        password: "123456789"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("DELETE /api/v1/users/:userId => should return a 200 response for a successful user delete", async () => {
    const token = await getAdminToken();

    const user = await User.create({
      name: "Delete",
      lastName: "Me",
      role: "user",
      email: "delete.me@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .delete(`/api/v1/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });
});
