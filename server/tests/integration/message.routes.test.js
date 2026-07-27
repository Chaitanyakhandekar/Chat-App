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
const { createTestUser, createTestChat, createTestMessage, createAuthenticatedRequest } = await import("../helpers/factory.js");

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Message Routes - Integration Tests", () => {
  describe("GET /api/messages/convo/:id", () => {
    test("should fetch conversation between users", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const friend = await createTestUser({
        username: `convo_${Date.now()}`,
        email: `convo_${Date.now()}@test.com`,
      });

      await createTestMessage({
        sender: user._id,
        receiver: friend._id,
        message: "Hello!",
      });

      const res = await get(`/api/messages/convo/${friend._id}`);
      expect(res.status).toBe(200);
    });

    test("should return empty array for no conversation", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const friend = await createTestUser({
        username: `empty_${Date.now()}`,
        email: `empty_${Date.now()}@test.com`,
      });

      const res = await get(`/api/messages/convo/${friend._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    test("should reject without auth", async () => {
      const res = await supertest(app).get(
        `/api/messages/convo/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/messages/for-me/:id", () => {
    test("should delete message for current user", async () => {
      const { user, delete: del } = await createAuthenticatedRequest(app);
      const message = await createTestMessage({ sender: user._id });

      const res = await del(`/api/messages/for-me/${message._id}`);
      expect(res.status).toBe(200);
    });

    test("should reject without auth", async () => {
      const res = await supertest(app).delete(
        `/api/messages/for-me/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/messages/for-everyone/:id", () => {
    test("should delete message for everyone", async () => {
      const { user, delete: del } = await createAuthenticatedRequest(app);
      const message = await createTestMessage({ sender: user._id });

      const res = await del(`/api/messages/for-everyone/${message._id}`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/messages/seen-by/:id", () => {
    test("should fetch seen members", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const message = await createTestMessage();

      const res = await get(`/api/messages/seen-by/${message._id}`);
      expect(res.status).toBe(200);
    });
  });
});
