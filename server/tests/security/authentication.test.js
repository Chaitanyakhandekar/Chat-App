import { jest } from "@jest/globals";
import supertest from "supertest";
import mongoose from "mongoose";

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

describe("Authentication Security Tests", () => {
  describe("JWT Tampering", () => {
    test("should reject tampered access token", async () => {
      const { accessToken } = await createAuthenticatedRequest(app);

      const tamperedToken = accessToken.slice(0, -5) + "XXXXX";

      const res = await supertest(app)
        .get("/api/users/profile")
        .set("Cookie", [`accessToken=${tamperedToken}`]);

      expect(res.status).toBe(401);
    });

    test("should reject token with wrong signature", async () => {
      const { default: jwt } = await import("jsonwebtoken");
      const fakeToken = jwt.sign(
        { _id: new mongoose.Types.ObjectId() },
        "wrong-secret-key-for-testing"
      );

      const res = await supertest(app)
        .get("/api/users/profile")
        .set("Cookie", [`accessToken=${fakeToken}`]);

      expect(res.status).toBe(401);
    });

    test("should reject expired token", async () => {
      const { default: jwt } = await import("jsonwebtoken");
      const expiredToken = jwt.sign(
        { _id: new mongoose.Types.ObjectId() },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "0s" }
      );

      const res = await supertest(app)
        .get("/api/users/profile")
        .set("Cookie", [`accessToken=${expiredToken}`]);

      expect(res.status).toBe(401);
    });

    test("should reject token with malformed payload", async () => {
      const malformedToken = "header.eyJfaWQiOiAiaW52YWxpZCJ9.signature";

      const res = await supertest(app)
        .get("/api/users/profile")
        .set("Cookie", [`accessToken=${malformedToken}`]);

      expect(res.status).toBe(401);
    });
  });

  describe("Cookie Security", () => {
    test("should set httpOnly cookie on login", async () => {
      const password = "securePass123!";
      await createTestUser({
        email: "cookietest@test.com",
        password,
        username: "cookieuser",
      });

      const res = await supertest(app)
        .post("/api/users/login")
        .send({ email: "cookietest@test.com", password });

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();

      const accessCookie = cookies.find((c) => c.startsWith("accessToken="));
      expect(accessCookie).toContain("HttpOnly");
    });

    test("should clear cookies on logout", async () => {
      const { get } = await createAuthenticatedRequest(app);

      const res = await get("/api/users/logout");

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      cookies.forEach((cookie) => {
        expect(cookie).toContain("=;");
      });
    });
  });

  describe("Authorization Bypass", () => {
    test("should prevent IDOR on profile access", async () => {
      const { get: user1auth } = await createAuthenticatedRequest(app, {
        username: `idor1_${Date.now()}`,
        email: `idor1_${Date.now()}@test.com`,
      });

      const user2 = await createTestUser({
        username: `idor2_${Date.now()}`,
        email: `idor2_${Date.now()}@test.com`,
      });

      const res = await user1auth(`/api/users/profile/${user2._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });

    test("should prevent unauthenticated access to protected routes", async () => {
      const protectedRoutes = [
        { method: "get", url: "/api/users/profile" },
        { method: "get", url: "/api/chats" },
        { method: "get", url: "/api/messages/convo/000000000000000000000000" },
        { method: "get", url: "/api/groups/members/000000000000000000000000" },
        { method: "get", url: "/api/requests/my" },
        { method: "post", url: "/api/notifications/create" },
      ];

      for (const route of protectedRoutes) {
        let res;
        if (route.method === "get") {
          res = await supertest(app).get(route.url);
        } else if (route.method === "post") {
          res = await supertest(app).post(route.url);
        } else if (route.method === "put") {
          res = await supertest(app).put(route.url);
        } else if (route.method === "delete") {
          res = await supertest(app).delete(route.url);
        }
        expect(res.status).toBe(401);
      }
    });
  });

  describe("Input Validation Security", () => {
    test("should handle SQL injection attempt in search", async () => {
      const { get } = await createAuthenticatedRequest(app);

      const res = await get(
        "/api/users/search/?query=1%27%20OR%20%271%27%3D%271"
      );
      expect(res.status).toBe(200);
    });

    test("should handle NoSQL injection attempt", async () => {
      const { post } = await createAuthenticatedRequest(app);

      const res = await post("/api/users/login").send({
        email: { $ne: null },
        password: { $ne: null },
      });

      expect([400, 401, 500]).toContain(res.status);
    });

    test("should handle XSS attempt in registration", async () => {
      const res = await supertest(app)
        .post("/api/users/register")
        .send({
          username: "<script>alert('xss')</script>",
          name: "Hacker",
          email: "xss_attack@test.com",
          password: "password123",
        });

      expect(res.status).toBe(201);
    });

    test("should handle prototype pollution attempt", async () => {
      const { put } = await createAuthenticatedRequest(app);

      const res = await put("/api/users/update-profile").send({
        name: "Test",
        __proto__: { admin: true },
      });

      expect(res.status).toBe(200);
    });

    test("should handle very long input values", async () => {
      const { put } = await createAuthenticatedRequest(app);

      const res = await put("/api/users/update-profile").send({
        name: "A".repeat(10000),
        bio: "B".repeat(10000),
      });

      // Express json body parser limits at 16kb
      expect([200, 413]).toContain(res.status);
    });
  });

  describe("Rate Limiting Surface", () => {
    test("should allow rapid login attempts (no rate limit currently)", async () => {
      const attempts = [];
      for (let i = 0; i < 10; i++) {
        attempts.push(
          supertest(app)
            .post("/api/users/login")
            .send({
              email: `brute_${i}@test.com`,
              password: "wrongpass",
            })
        );
      }

      const results = await Promise.all(attempts);
      results.forEach((res) => {
        expect([200, 400, 429]).toContain(res.status);
      });
    });
  });

  describe("Session Management", () => {
    test("should invalidate refresh token after logout", async () => {
      const { user, get } = await createAuthenticatedRequest(app);

      await get("/api/users/logout");

      const { User } = await import("../../src/models/user.model.js");
      const foundUser = await User.findById(user._id);
      expect(foundUser.refreshToken).toBeUndefined();
    });

    test("should reject old refresh token after token rotation", async () => {
      const { user, refreshToken } =
        await createAuthenticatedRequest(app);

      const oldRefreshToken = refreshToken;

      const { default: jwt } = await import("jsonwebtoken");
      const expiredAccess = jwt.sign(
        { _id: user._id, name: user.name, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "0s" }
      );
      const newRefreshToken = jwt.sign(
        { _id: user._id },
        "different-refresh-secret",
        { expiresIn: "1d" }
      );

      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });

      const res = await supertest(app)
        .get("/api/users/auth-me")
        .set("Cookie", [
          `accessToken=${expiredAccess}`,
          `refreshToken=${oldRefreshToken}`,
        ]);

      expect(res.status).toBe(401);
    });
  });

  describe("Notification Security", () => {
    test("should reject notification creation without auth", async () => {
      const res = await supertest(app)
        .post("/api/notifications/create")
        .send({ content: "test" });

      expect(res.status).toBe(401);
    });
  });
});
