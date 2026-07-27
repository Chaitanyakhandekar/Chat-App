import { jest } from "@jest/globals";
import supertest from "supertest";

const mockIo = { to: jest.fn(() => ({ emit: jest.fn() })) };

jest.unstable_mockModule("../../src/sockets/socketInstance.js", () => ({
  getIO: jest.fn(() => mockIo),
  setIO: jest.fn(),
}));

jest.unstable_mockModule("../../src/sockets/soketsMap.js", () => ({
  getUserSocket: jest.fn(() => null),
  addUserSocket: jest.fn(),
  removeUserSocket: jest.fn(),
  socketsMap: new Map(),
}));

jest.unstable_mockModule("../../src/services/brevoMail.service.js", () => ({
  sendEmail: jest.fn(() => Promise.resolve({ success: true })),
}));

const { app } = await import("../../src/server.js");
const { connectTestDB, disconnectTestDB, clearTestDB } = await import("../helpers/mongoSetup.js");
const { createTestUser, createAuthenticatedRequest } = await import("../helpers/factory.js");

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("User Routes - Integration Tests", () => {
  describe("POST /api/users/register", () => {
    test("should register a new user successfully", async () => {
      const res = await supertest(app)
        .post("/api/users/register")
        .send({
          username: "newuser",
          name: "New User",
          email: "newuser@example.com",
          password: "password123",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test("should reject registration with missing fields", async () => {
      const res = await supertest(app)
        .post("/api/users/register")
        .send({ username: "test" });

      expect(res.status).toBe(400);
    });

    test("should reject registration with short password", async () => {
      const res = await supertest(app)
        .post("/api/users/register")
        .send({
          username: "testuser",
          name: "Test",
          email: "test@test.com",
          password: "123",
        });

      expect(res.status).toBe(400);
    });

    test("should reject duplicate email", async () => {
      await createTestUser({
        email: "duplicate@test.com",
        username: "existing",
      });

      const res = await supertest(app)
        .post("/api/users/register")
        .send({
          username: "newguy",
          name: "New",
          email: "duplicate@test.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });

    test("should reject duplicate username", async () => {
      await createTestUser({
        username: "takenuser",
        email: "first@test.com",
      });

      const res = await supertest(app)
        .post("/api/users/register")
        .send({
          username: "takenuser",
          name: "New",
          email: "second@test.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/users/login", () => {
    test("should login with valid credentials", async () => {
      const password = "testPass123!";
      await createTestUser({
        email: "logintest@example.com",
        password,
        username: "loginuser",
      });

      const res = await supertest(app)
        .post("/api/users/login")
        .send({
          email: "logintest@example.com",
          password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("should reject login with wrong password", async () => {
      await createTestUser({
        email: "wrongpass@example.com",
        password: "correctPass123",
        username: "wrongpassuser",
      });

      const res = await supertest(app)
        .post("/api/users/login")
        .send({
          email: "wrongpass@example.com",
          password: "wrongPassword",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(false);
    });

    test("should reject login with non-existent email", async () => {
      const res = await supertest(app)
        .post("/api/users/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(false);
    });

    test("should reject login with missing fields", async () => {
      const res = await supertest(app)
        .post("/api/users/login")
        .send({ email: "test@test.com" });

      expect(res.status).toBe(400);
    });

    test("should reject login with empty fields", async () => {
      const res = await supertest(app)
        .post("/api/users/login")
        .send({ email: "", password: "" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/users/auth-me", () => {
    test("should authenticate with valid tokens", async () => {
      const { get } = await createAuthenticatedRequest(app);

      const res = await get("/api/users/auth-me");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should reject without cookies", async () => {
      const res = await supertest(app).get("/api/users/auth-me");
      expect(res.status).toBe(401);
    });

    test("should reject with expired access token but refresh", async () => {
      const user = await createTestUser();
      const { default: jwt } = await import("jsonwebtoken");
      const expiredAccess = jwt.sign(
        { _id: user._id, name: user.name, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "0s" }
      );
      const validRefresh = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1d" }
      );

      user.refreshToken = validRefresh;
      await user.save({ validateBeforeSave: false });

      const res = await supertest(app)
        .get("/api/users/auth-me")
        .set("Cookie", [
          `accessToken=${expiredAccess}`,
          `refreshToken=${validRefresh}`,
        ]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/users/logout", () => {
    test("should logout authenticated user", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const res = await get("/api/users/logout");
      expect(res.status).toBe(200);
    });

    test("should reject logout without auth", async () => {
      const res = await supertest(app).get("/api/users/logout");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/users/profile", () => {
    test("should fetch authenticated user profile", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const res = await get("/api/users/profile");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should reject profile fetch without auth", async () => {
      const res = await supertest(app).get("/api/users/profile");
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/users/update-profile", () => {
    test("should update user profile", async () => {
      const { put } = await createAuthenticatedRequest(app);
      const res = await put("/api/users/update-profile").send({
        name: "Updated Name",
        bio: "New bio here",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Updated Name");
    });

    test("should reject update without auth", async () => {
      const res = await supertest(app)
        .put("/api/users/update-profile")
        .send({ name: "Hacker" });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/users/search", () => {
    test("should search users by query", async () => {
      await createTestUser({
        username: "searchableuser",
        email: "search@test.com",
        name: "Searchable",
      });

      const { get } = await createAuthenticatedRequest(app);
      const res = await get("/api/users/search/?query=searchable");

      expect(res.status).toBe(200);
    });

    test("should reject search without auth", async () => {
      const res = await supertest(app).get("/api/users/search/?query=test");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/users/password/reset/otp", () => {
    test("should send OTP for existing email", async () => {
      await createTestUser({
        email: "otpuser@test.com",
        username: "otpuser",
      });

      const res = await supertest(app)
        .post("/api/users/password/reset/otp")
        .send({ email: "otpuser@test.com" });

      expect(res.status).toBe(200);
    });

    test("should reject OTP without email", async () => {
      const res = await supertest(app)
        .post("/api/users/password/reset/otp")
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/users/chat-partners", () => {
    test("should fetch online partners", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const res = await get("/api/users/chat-partners");
      expect(res.status).toBe(200);
    });
  });
});
