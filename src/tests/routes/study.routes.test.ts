import request from "supertest";
import app from "../setup/app";
import User from "../../models/user.model";
import Study from "../../models/study.model";

describe("STUDY ROUTES", () => {
  const user = {
    name: "John",
    lastName: "Smith",
    role: "user",
    email: "john.smith@addressdashboard.com",
    password: "123456789",
    passwordConfirmation: "123456789"
  };

  it("POST /api/v1/users/:userId/studies => should return a 400 response for invalid user ID", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .post("/api/v1/users/invalid-id/studies")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users/:userId/studies => should return a 404 response if user does not exist", async () => {
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
      .post(`/api/v1/users/${fakeUserId}/studies`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users/:userId/studies => should display input validation errors", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToAddStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .post(`/api/v1/users/${userToAddStudy._id}/studies`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(4);

    expect(res.status).not.toBe(201);
    expect(res.body).not.toHaveProperty("message");
  });

  it("POST /api/v1/users/:userId/studies => should return a 201 response for the creation of a new user study", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToAddStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .post(`/api/v1/users/${userToAddStudy._id}/studies`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Title 123",
        institution: "Institution 123",
        startDate: "2022-01-01",
        endDate: "2025-12-12"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("GET /api/v1/users/:userId/studies => should return a data property with an array of user studies", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetStudies = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetStudies._id}/studies`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
    expect(res.body).not.toHaveProperty("error");
  });

  it("GET /api/v1/users/:userId/studies/:studyId => should return a 400 response for invalid study ID", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetStudy._id}/studies/invalid-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId/studies/:studyId => should return a 404 response if study does not exist", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const fakeStudyId = "69ac69750ddb9678b2686531";

    const userToGetStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetStudy._id}/studies/${fakeStudyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId/studies/:studyId => should return a 403 response if study does not belongs to user", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);
    const loggedUser = await User.findOne({ email: user.email });

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const study = await Study.create({
      title: "Title 123",
      institution: "Institution 123",
      startDate: "2022-01-01",
      endDate: "2025-12-12",
      user: userToGetStudy._id
    });

    const res = await request(app)
      .get(`/api/v1/users/${loggedUser._id}/studies/${study._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("GET /api/v1/users/:userId/studies/:studyId => should return a data property with an object of the user study", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToGetStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const study = await Study.create({
      title: "Title 123",
      institution: "Institution 123",
      startDate: "2022-01-01",
      endDate: "2025-12-12",
      user: userToGetStudy._id
    });

    const res = await request(app)
      .get(`/api/v1/users/${userToGetStudy._id}/studies/${study._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("PUT /api/v1/users/:userId/studies/:studyId => should display input validation errors", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToUpdateStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const study = await Study.create({
      title: "Title 123",
      institution: "Institution 123",
      startDate: "2022-01-01",
      endDate: "2025-12-12",
      user: userToUpdateStudy._id
    });

    const res = await request(app)
      .put(`/api/v1/users/${userToUpdateStudy._id}/studies/${study._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("message");
  });

  it("PUT /api/v1/users/:userId/studies/:studyId => should return a 200 response for a successful study update", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToUpdateStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const study = await Study.create({
      title: "Title 123",
      institution: "Institution 123",
      startDate: "2022-01-01",
      endDate: "2025-12-12",
      user: userToUpdateStudy._id
    });

    const res = await request(app)
      .put(`/api/v1/users/${userToUpdateStudy._id}/studies/${study._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Title 1234",
        institution: "Institution 1234",
        startDate: "2022-02-02",
        endDate: "2025-12-13"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });

  it("DELETE /api/v1/users/:userId/studies/:studyId => should return a 200 response for a successful study delete", async () => {
    // Register an user
    await request(app).post("/api/v1/auth/register").send(user);

    // Login the user and get token
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    const token = loginRes.body.token;

    const userToDeleteStudy = await User.create({
      name: "Test",
      lastName: "User",
      role: "user",
      email: "test.user@addressdashboard.com",
      password: "123456789"
    });

    const study = await Study.create({
      title: "Title 123",
      institution: "Institution 123",
      startDate: "2022-01-01",
      endDate: "2025-12-12",
      user: userToDeleteStudy._id
    });

    const res = await request(app)
      .delete(`/api/v1/users/${userToDeleteStudy._id}/studies/${study._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });
});
