import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
import { User } from "../../src/models/user.model.js";
import { Message } from "../../src/models/message.model.js";
import { Request } from "../../src/models/request.model.js";
import { Notification } from "../../src/models/notification.model.js";

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

describe("generateTokens Service", () => {
  test("should return both tokens", async () => {
    const user = await createUser();
    const { generateTokens } = await import("../../src/services/generateTokens.js");
    const tokens = generateTokens(user);
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });
});

describe("message.service", () => {
  test("deleteForMeService should add userId to deletedFor", async () => {
    const user = await createUser();
    const message = await Message.create({
      chatId: new mongoose.Types.ObjectId(), sender: user._id,
      receiver: new mongoose.Types.ObjectId(), message: "test",
    });
    const { deleteForMeService } = await import("../../src/services/message.service.js");
    const result = await deleteForMeService(message._id, user._id);
    expect(result.deletedFor).toHaveLength(1);
  });

  test("deleteForEveryoneService should mark message", async () => {
    const msg = await Message.create({
      chatId: new mongoose.Types.ObjectId(), sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(), message: "test",
    });
    const { deleteForEveryoneService } = await import("../../src/services/message.service.js");
    const result = await deleteForEveryoneService(msg._id);
    expect(result.deleteForEveryone).toBe(true);
  });

  test("getSeenMembersService should return empty", async () => {
    const msg = await Message.create({
      chatId: new mongoose.Types.ObjectId(), sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(), message: "test",
    });
    const { getSeenMembersService } = await import("../../src/services/message.service.js");
    expect(await getSeenMembersService(msg._id)).toEqual([]);
  });
});

describe("notification.service", () => {
  test("should create notification", async () => {
    const s = await createUser(); const r = await createUser();
    const { createNotificationService } = await import("../../src/services/notification.service.js");
    const n = await createNotificationService(s._id, s._id, [r._id], "message", null, false, "Test", "");
    expect(n.type).toBe("message");
  });

  test("should reject without type", async () => {
    const s = await createUser(); const r = await createUser();
    const { createNotificationService } = await import("../../src/services/notification.service.js");
    await expect(createNotificationService(s._id, s._id, [r._id], "", null, false, "", "")).rejects.toThrow();
  });
});

describe("request.service", () => {
  test("createFriendRequest should create request", async () => {
    const u = await createUser(); const f = await createUser();
    const { createFriendRequest } = await import("../../src/services/request.service.js");
    const req = await createFriendRequest(u._id, f._id);
    expect(req.type).toBe("DIRECT_CHAT_REQUEST");
  });

  test("should reject duplicate request", async () => {
    const u = await createUser(); const f = await createUser();
    const { createFriendRequest } = await import("../../src/services/request.service.js");
    await createFriendRequest(u._id, f._id);
    await expect(createFriendRequest(u._id, f._id)).rejects.toThrow();
  });

  test("rejectRequestService should work", async () => {
    const u = await createUser(); const f = await createUser();
    const request = await Request.create({
      type: "DIRECT_CHAT_REQUEST", sender: f._id, receiver: u._id, message: "hi",
    });
    const { rejectRequestService } = await import("../../src/services/request.service.js");
    const result = await rejectRequestService(request._id, u._id);
    expect(result.status).toBe("rejected");
  });

  test("should reject non-receiver", async () => {
    const u = await createUser(); const f = await createUser(); const s = await createUser();
    const request = await Request.create({
      type: "DIRECT_CHAT_REQUEST", sender: f._id, receiver: u._id, message: "hi",
    });
    const { rejectRequestService } = await import("../../src/services/request.service.js");
    await expect(rejectRequestService(request._id, s._id)).rejects.toThrow();
  });
});

describe("cloudinary.service", () => {
  test("uploadFileOnCloudinary should fail without file", async () => {
    const { uploadFileOnCloudinary } = await import("../../src/services/cloudinary.service.js");
    expect(await uploadFileOnCloudinary(null)).toBeNull();
  });
});

describe("utility functions", () => {
  test("validObjectId", async () => {
    const { validObjectId } = await import("../../src/utils/isValidObjectId.js");
    expect(validObjectId(new mongoose.Types.ObjectId().toString())).toBe(true);
    expect(validObjectId("bad")).toBe(false);
    expect(validObjectId("")).toBe(false);
    expect(validObjectId(null)).toBe(false);
  });

  test("getUniqueMembers", async () => {
    const { getUniqueMembers } = await import("../../src/utils/getUniqueMembers.js");
    expect(getUniqueMembers(["a","b"], ["b","c"])).toEqual(["a","c"]);
    expect(getUniqueMembers([], [])).toEqual([]);
  });

  test("assertRequiredFields", async () => {
    const { assertRequiredFields } = await import("../../src/utils/fields validations/assertRequiredFields.js");
    expect(() => assertRequiredFields(["ok"])).not.toThrow();
    expect(() => assertRequiredFields([""])).toThrow();
    expect(() => assertRequiredFields([null])).toThrow();
  });

  test("asyncHandler catches errors", async () => {
    const { asyncHandler } = await import("../../src/utils/asyncHandler.js");
    const handler = asyncHandler(async (req, res) => { throw new Error("fail"); });
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await handler({}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test("asyncHandler passes success", async () => {
    const { asyncHandler } = await import("../../src/utils/asyncHandler.js");
    const handler = asyncHandler(async (req, res) => { res.status(200).json({ ok: true }); });
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await handler({}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
