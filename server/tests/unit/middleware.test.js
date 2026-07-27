import { jest } from "@jest/globals";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
import { User } from "../../src/models/user.model.js";
import { Chat } from "../../src/models/chat.model.js";

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
    username: `u_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "Test",
    email: `e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@test.com`,
    password: "password123",
    ...overrides,
  };
  return await User.create(data);
};

describe("userAuth Middleware", () => {
  test("should reject without accessToken", async () => {
    const req = { cookies: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    const { userAuth } = await import("../../src/middlewares/userAuth.middleware.js");
    await userAuth(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test("should reject with empty accessToken", async () => {
    const req = { cookies: { accessToken: "" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    const { userAuth } = await import("../../src/middlewares/userAuth.middleware.js");
    await userAuth(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test("should reject invalid token", async () => {
    const req = { cookies: { accessToken: "bad-token" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    const { userAuth } = await import("../../src/middlewares/userAuth.middleware.js");
    await userAuth(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test("should pass with valid token", async () => {
    const user = await createUser();
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" }
    );
    const req = { cookies: { accessToken: token } };
    const res = {};
    const next = jest.fn();
    const { userAuth } = await import("../../src/middlewares/userAuth.middleware.js");
    await userAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user._id.toString()).toBe(user._id.toString());
  });

  test("should handle login-check-hit header", async () => {
    const req = { cookies: {}, headers: { "x-auth-check-type": "login-check-hit" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    const { userAuth } = await import("../../src/middlewares/userAuth.middleware.js");
    await userAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("adminPermission Middleware", () => {
  test("should let admin proceed", async () => {
    const admin = await createUser();
    const group = await Chat.create({
      participants: [admin._id], isGroupChat: true, groupName: "TG",
      createdBy: admin._id, admins: [admin._id],
    });
    const req = { body: { groupId: group._id.toString() }, user: admin };
    const next = jest.fn();
    const { adminPermission } = await import("../../src/middlewares/adminPermission.middleware.js");
    await adminPermission(req, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test("should reject non-admin", async () => {
    const admin = await createUser();
    const member = await createUser();
    const group = await Chat.create({
      participants: [admin._id, member._id], isGroupChat: true, groupName: "TG",
      createdBy: admin._id, admins: [admin._id],
    });
    const req = { body: { groupId: group._id.toString() }, user: member };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    const { adminPermission } = await import("../../src/middlewares/adminPermission.middleware.js");
    await adminPermission(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "You are not an admin of this group" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should reject missing groupId", async () => {
    const req = { body: {}, user: await createUser() };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    const { adminPermission } = await import("../../src/middlewares/adminPermission.middleware.js");
    await adminPermission(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should reject non-group chat", async () => {
    const u1 = await createUser();
    const u2 = await createUser();
    const chat = await Chat.create({ participants: [u1._id, u2._id], isGroupChat: false });
    const req = { body: { groupId: chat._id.toString() }, user: u1 };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    const { adminPermission } = await import("../../src/middlewares/adminPermission.middleware.js");
    await adminPermission(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
