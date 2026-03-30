import request from "supertest";
import app from "../setup/app";
import User from "../../models/user.model";
import Address from "../../models/address.model";

describe("ADDRESS ROUTES", () => {
  const user = {
    name: "John",
    lastName: "Smith",
    role: "user",
    email: "john.smith@addressdashboard.com",
    password: "123456789",
    passwordConfirmation: "123456789"
  };

  it("POST /api/v1/users/:userId/addresses => should return a 400 response for invalid user ID", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .post("/api/v1/users/invalid-id/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users/:userId/addresses => should return a 404 response if user does not exist", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const fakeUserId = "69af242036feaf200a14b371";

    const res = await request(app)
      .post(`/api/v1/users/${fakeUserId}/addresses`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users/:userId/addresses => should display input validation errors", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToAddAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .post(`/api/v1/users/${userToAddAddress._id}/addresses`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(4);

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users/:userId/addresses => should return a 201 response for the creation of a new user address", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToAddAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .post(`/api/v1/users/${userToAddAddress._id}/addresses`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "9 de Julio 000",
        city: "Ciudad 123",
        province: "Provincia 456",
        country: "Argentina"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("GET /api/v1/users/:userId/addresses => should return a data property with an array of user addresses", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetAddresses = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetAddresses._id}/addresses`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
    expect(res.body).not.toHaveProperty("error");
  });

  it("GET /api/v1/users/:userId/addresses/:addressId => should return a 400 response for invalid address ID", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetAddress._id}/addresses/invalid-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId/addresses/:addressId => should return a 404 response if address does not exist", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const fakeAddressId = "69ac69750ddb9678b2686531";

    const userToGetAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetAddress._id}/addresses/${fakeAddressId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId/addresses/:addressId => should return a 403 response if address does not belongs to user", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);
    const loggedUser = await User.findOne({ email: user.email });

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const address = await Address.create({
      street: "Fake 123",
      city: "Tucuman",
      province: "Tucuman",
      country: "Argentina",
      user: userToGetAddress._id
    });

    const res = await request(app)
      .get(`/api/v1/users/${loggedUser._id}/addresses/${address._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId/addresses/:addressId => should return a data property with an object of the user address", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const address = await Address.create({
      street: "Viento 123",
      city: "Puerto Madryn",
      province: "Chubut",
      country: "Argentina",
      user: userToGetAddress._id
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetAddress._id}/addresses/${address._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("PUT /api/v1/users/:userId/addresses/:addressId => should display input validation errors", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToUpdateAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const address = await Address.create({
      street: "Viento 123",
      city: "Puerto Madryn",
      province: "Chubut",
      country: "Argentina",
      user: userToUpdateAddress._id
    });

    const res = await request(app)
      .put(`/api/v1/users/${userToUpdateAddress._id}/addresses/${address._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("message");
  });

  it("PUT /api/v1/users/:userId/addresses/:addressId => should return a 200 response for a successful address update", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToUpdateAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const address = await Address.create({
      street: "Viento 123",
      city: "Puerto Madryn",
      province: "Chubut",
      country: "Argentina",
      user: userToUpdateAddress._id
    });

    const res = await request(app)
      .put(`/api/v1/users/${userToUpdateAddress._id}/addresses/${address._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "Street 123",
        city: "City 123",
        province: "Province 123",
        country: "Country 123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("DELETE /api/v1/users/:userId/addresses/:addressId => should return a 200 response for a successful address delete", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToDeleteAddress = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const address = await Address.create({
      street: "Viento 123",
      city: "Puerto Madryn",
      province: "Chubut",
      country: "Argentina",
      user: userToDeleteAddress._id
    });

    const res = await request(app)
      .delete(`/api/v1/users/${userToDeleteAddress._id}/addresses/${address._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });
});
