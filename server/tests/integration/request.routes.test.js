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
const { createTestUser, createTestRequest, createAuthenticatedRequest } = await import("../helpers/factory.js");

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Request Routes - Integration Tests", () => {
  describe("POST /api/requests/friend-request/:id", () => {
    test("should send friend request", async () => {
      const { post } = await createAuthenticatedRequest(app);
      const friend = await createTestUser({
        username: `fr_${Date.now()}`,
        email: `fr_${Date.now()}@test.com`,
      });

      const res = await post(`/api/requests/friend-request/${friend._id}`);
      expect(res.status).toBe(201);
    });

    test("should reject duplicate friend request", async () => {
      const { post } = await createAuthenticatedRequest(app);
      const friend = await createTestUser({
        username: `fr_dup_${Date.now()}`,
        email: `fr_dup_${Date.now()}@test.com`,
      });

      await post(`/api/requests/friend-request/${friend._id}`);
      const res = await post(`/api/requests/friend-request/${friend._id}`);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/requests/my", () => {
    test("should fetch user requests", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const sender = await createTestUser({
        username: `sender_${Date.now()}`,
        email: `sender_${Date.now()}@test.com`,
      });

      await createTestRequest({ sender: sender._id, receiver: user._id });

      const res = await get("/api/requests/my");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/requests/friend-request/accept/:id", () => {
    test("should accept friend request", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const sender = await createTestUser({
        username: `accept_sender_${Date.now()}`,
        email: `accept_sender_${Date.now()}@test.com`,
      });

      const request = await createTestRequest({
        sender: sender._id,
        receiver: user._id,
      });

      const res = await get(
        `/api/requests/friend-request/accept/${request._id}`
      );
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/requests/friend-request/reject/:id", () => {
    test("should reject friend request", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const sender = await createTestUser({
        username: `reject_sender_${Date.now()}`,
        email: `reject_sender_${Date.now()}@test.com`,
      });

      const request = await createTestRequest({
        sender: sender._id,
        receiver: user._id,
      });

      const res = await get(
        `/api/requests/friend-request/reject/${request._id}`
      );
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("rejected");
    });
  });
});
