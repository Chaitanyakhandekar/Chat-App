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

describe("Notification Routes - Integration Tests", () => {
  describe("GET /api/notifications/my", () => {
    test("should fetch user notifications", async () => {
      const { get } = await createAuthenticatedRequest(app);
      const res = await get("/api/notifications/my");
      expect(res.status).toBe(200);
    });

    test("should reject without auth", async () => {
      const res = await supertest(app).get("/api/notifications/my");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/notifications/create", () => {
    test("should create notification for another user", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const receiver = await createTestUser({
        username: `notif_recv_${Date.now()}`,
        email: `notif_recv_${Date.now()}@test.com`,
      });

      const res = await post("/api/notifications/create").send({
        receiverId: receiver._id.toString(),
        type: "message",
        content: "You have a new message",
        entityId: null,
        isGroupChatNotification: false,
      });

      expect(res.status).toBe(201);
    });
  });

  describe("POST /api/notifications/mark-all-read", () => {
    test("should mark all notifications as read", async () => {
      const { post } = await createAuthenticatedRequest(app);

      const res = await post("/api/notifications/mark-all-read").send({
        count: 5,
      });

      expect(res.status).toBe(200);
    });

    test("should handle zero count gracefully", async () => {
      const { post } = await createAuthenticatedRequest(app);

      const res = await post("/api/notifications/mark-all-read").send({
        count: 0,
      });

      expect(res.status).toBe(200);
    });
  });
});
