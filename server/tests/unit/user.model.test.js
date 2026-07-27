import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
import { User } from "../../src/models/user.model.js";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

const createUser = async (overrides = {}) => {
  const data = {
    username: `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "Test User",
    email: `email_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@test.com`,
    password: "password123",
    ...overrides,
  };
  return await User.create(data);
};

describe("User Model - Unit Tests", () => {
  describe("User Creation", () => {
    test("should create a valid user with all required fields", async () => {
      const user = await createUser();
      expect(user).toBeDefined();
      expect(user.isVerified).toBe(false);
      expect(user.avtar).toBeDefined();
    });

    test("should hash password before saving", async () => {
      const user = await createUser({ password: "mySecretPass123" });
      expect(user.password).not.toBe("mySecretPass123");
      expect(user.password).toMatch(/^\$2[abxy]\$\d+\$/);
    });

    test("should reject duplicate email", async () => {
      const email = `dup_${Date.now()}@test.com`;
      await createUser({ email, username: `u1_${Date.now()}` });
      await expect(createUser({ email, username: `u2_${Date.now()}` })).rejects.toThrow();
    });

    test("should reject duplicate username", async () => {
      const username = `uniq_${Date.now()}`;
      await createUser({ username, email: `e1_${Date.now()}@test.com` });
      await expect(createUser({ username, email: `e2_${Date.now()}@test.com` })).rejects.toThrow();
    });

    test("should lowercase email", async () => {
      const user = await createUser({ email: `UPPER_${Date.now()}@EXAMPLE.COM` });
      expect(user.email).toContain("@example.com");
    });

    test("should set default avatar", async () => {
      const user = await createUser();
      expect(user.avtar).toContain("https://");
    });

    test("should fail with missing required fields", async () => {
      const user = new User({});
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe("Password Validation", () => {
    test("isCorrectPassword returns true for correct password", async () => {
      const user = await createUser({ password: "correctPassword" });
      expect(await user.isCorrectPassword("correctPassword")).toBe(true);
    });

    test("isCorrectPassword returns false for incorrect password", async () => {
      const user = await createUser({ password: "correctPassword" });
      expect(await user.isCorrectPassword("wrongPassword")).toBe(false);
    });
  });

  describe("Token Generation", () => {
    test("generateAccessToken returns valid JWT", async () => {
      const user = await createUser();
      const token = user.generateAccessToken();
      expect(token.split(".")).toHaveLength(3);

      const jwtMod = await import("jsonwebtoken");
      const decoded = jwtMod.default.verify(token, process.env.JWT_ACCESS_SECRET);
      expect(decoded._id.toString()).toBe(user._id.toString());
      expect(decoded.name).toBe(user.name);
    });

    test("generateRefreshToken returns valid JWT", async () => {
      const user = await createUser();
      const token = user.generateRefreshToken();
      expect(token.split(".")).toHaveLength(3);

      const jwtMod = await import("jsonwebtoken");
      const decoded = jwtMod.default.verify(
        token,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET
      );
      expect(decoded._id.toString()).toBe(user._id.toString());
      expect(decoded.name).toBeUndefined();
    });
  });
});
