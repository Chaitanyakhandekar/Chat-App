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
const { createTestUser, createTestChat, createAuthenticatedRequest } = await import("../helpers/factory.js");

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Chat Routes - Integration Tests", () => {
  describe("POST /api/chats/single/:userId", () => {
    test("should create single chat between two users", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const friend = await createTestUser({
        username: `friend_${Date.now()}`,
        email: `friend_${Date.now()}@test.com`,
      });

      const res = await post(`/api/chats/single/${friend._id}`);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test("should reject creating chat with self", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const res = await post(`/api/chats/single/${user._id}`);
      expect(res.status).toBe(201);
    });

    test("should reject duplicate chat", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const friend = await createTestUser({
        username: `dup_friend_${Date.now()}`,
        email: `dup_friend_${Date.now()}@test.com`,
      });

      await post(`/api/chats/single/${friend._id}`);
      const res = await post(`/api/chats/single/${friend._id}`);
      expect(res.status).toBe(400);
    });

    test("should reject without auth", async () => {
      const res = await supertest(app).post(
        `/api/chats/single/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/chats/group", () => {
    test("should create a group chat", async () => {
      const { post } = await createAuthenticatedRequest(app);

      const res = await post("/api/chats/group").send({
        groupName: "Test Group",
      });

      expect(res.status).toBe(201);
      expect(res.body.data.isGroupChat).toBe(true);
      expect(res.body.data.groupName).toBe("Test Group");
    });

    test("should create group with participants", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const member1 = await createTestUser({
        username: `gm1_${Date.now()}`,
        email: `gm1_${Date.now()}@test.com`,
      });
      const member2 = await createTestUser({
        username: `gm2_${Date.now()}`,
        email: `gm2_${Date.now()}@test.com`,
      });

      const res = await post("/api/chats/group").send({
        groupName: "Group With Members",
        participants: [member1._id.toString(), member2._id.toString()],
      });

      expect(res.status).toBe(201);
      expect(res.body.data.participants).toHaveLength(3);
    });

    test("should reject group without name", async () => {
      const { post } = await createAuthenticatedRequest(app);
      const res = await post("/api/chats/group").send({});
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/chats", () => {
    test("should fetch user chats", async () => {
      const { user, get } = await createAuthenticatedRequest(app);

      const friend = await createTestUser({
        username: `chatfriend_${Date.now()}`,
        email: `chatfriend_${Date.now()}@test.com`,
      });
      await createTestChat([user._id, friend._id]);

      const res = await get("/api/chats");
      expect(res.status).toBe(200);
    });

    test("should return empty array for new user", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const res = await get("/api/chats");
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    test("should reject without auth", async () => {
      const res = await supertest(app).get("/api/chats");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/chats/user", () => {
    test("should fetch chat users", async () => {
      const { user, get } = await createAuthenticatedRequest(app);

      const friend = await createTestUser({
        username: `cu_${Date.now()}`,
        email: `cu_${Date.now()}@test.com`,
      });
      await createTestChat([user._id, friend._id]);

      const res = await get("/api/chats/user");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/chats/exists/:chatId", () => {
    test("should check if chat exists", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const friend = await createTestUser({
        username: `exist_${Date.now()}`,
        email: `exist_${Date.now()}@test.com`,
      });
      const chat = await createTestChat([user._id, friend._id]);

      const res = await get(`/api/chats/exists/${chat._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.isChatExists).toBe(true);
    });

    test("should return false for non-existent chat", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const res = await get(
        `/api/chats/exists/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(200);
      expect(res.body.data.isChatExists).toBe(false);
    });
  });
});
