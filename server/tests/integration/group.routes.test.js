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
const { createTestUser, createTestGroup, createAuthenticatedRequest } = await import("../helpers/factory.js");

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Group Routes - Integration Tests", () => {
  describe("GET /api/groups/members/:id", () => {
    test("should fetch group members", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const member = await createTestUser({
        username: `gmember_${Date.now()}`,
        email: `gmember_${Date.now()}@test.com`,
      });
      const group = await createTestGroup(user._id, [member._id]);

      const res = await get(`/api/groups/members/${group._id}`);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/groups/add-member", () => {
    test("should add member to group (admin only)", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const member = await createTestUser({
        username: `newmember_${Date.now()}`,
        email: `newmember_${Date.now()}@test.com`,
      });
      const group = await createTestGroup(user._id);

      const res = await post("/api/groups/add-member").send({
        groupId: group._id.toString(),
        memberId: member._id.toString(),
      });

      expect(res.status).toBe(200);
    });

    test("should reject non-admin from adding members", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const nonAdmin = await createTestUser({
        username: `nonadmin_${Date.now()}`,
        email: `nonadmin_${Date.now()}@test.com`,
      });
      const newMember = await createTestUser({
        username: `victim_${Date.now()}`,
        email: `victim_${Date.now()}@test.com`,
      });

      const group = await createTestGroup(user._id, [nonAdmin._id]);

      const agent = supertest.agent(app);
      const { default: jwt } = await import("jsonwebtoken");
      const token = jwt.sign(
        { _id: nonAdmin._id, name: nonAdmin.name, email: nonAdmin.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" }
      );

      const res = await agent
        .post("/api/groups/add-member")
        .set("Cookie", [`accessToken=${token}`, `refreshToken=dummy`])
        .send({
          groupId: group._id.toString(),
          memberId: newMember._id.toString(),
        });

      expect(res.status).toBe(403);
    });
  });

  describe("PUT /api/groups/update/:id", () => {
    test("should update group details", async () => {
      const { user, put } = await createAuthenticatedRequest(app);
      const group = await createTestGroup(user._id);

      const res = await put(`/api/groups/update/${group._id}`).send({
        groupName: "Updated Group Name",
      });

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/groups/mark-admin", () => {
    test("should mark member as admin", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const member = await createTestUser({
        username: `markadmin_${Date.now()}`,
        email: `markadmin_${Date.now()}@test.com`,
      });
      const group = await createTestGroup(user._id, [member._id]);

      const res = await post("/api/groups/mark-admin").send({
        groupId: group._id.toString(),
        memberId: member._id.toString(),
      });

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/groups/unmark-admin", () => {
    test("should unmark member as admin", async () => {
      const { user, post } = await createAuthenticatedRequest(app);
      const group = await createTestGroup(user._id);

      const res = await post("/api/groups/unmark-admin").send({
        groupId: group._id.toString(),
        memberId: user._id.toString(),
      });

      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/groups/delete/:id", () => {
    test("should allow group creator to delete", async () => {
      const { user, delete: del } = await createAuthenticatedRequest(app);
      const group = await createTestGroup(user._id);

      const res = await del(`/api/groups/delete/${group._id}`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/groups/leave/:id", () => {
    test("should allow member to leave group", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const member = await createTestUser({
        username: `leaver_${Date.now()}`,
        email: `leaver_${Date.now()}@test.com`,
      });
      const group = await createTestGroup(member._id, [user._id]);

      const res = await get(`/api/groups/leave/${group._id}`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/groups/media/:id", () => {
    test("should fetch group media", async () => {
      const { user, get } = await createAuthenticatedRequest(app);
      const group = await createTestGroup(user._id);

      const res = await get(`/api/groups/media/${group._id}`);
      expect(res.status).toBe(200);
    });
  });
});
