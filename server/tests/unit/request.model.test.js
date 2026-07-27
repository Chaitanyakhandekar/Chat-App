import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
import { Request } from "../../src/models/request.model.js";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Request Model - Unit Tests", () => {
  test("should create a valid request", async () => {
    const request = await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "friend request",
    });

    expect(request).toBeDefined();
    expect(request.type).toBe("DIRECT_CHAT_REQUEST");
    expect(request.status).toBe("pending");
  });

  test("should default status to pending", async () => {
    const request = await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
    });

    expect(request.status).toBe("pending");
  });

  test("should accept valid request types", async () => {
    const validTypes = [
      "DIRECT_CHAT_REQUEST",
      "GROUP_INVITE",
      "GROUP_JOIN_REQUEST",
    ];

    for (const type of validTypes) {
      const request = await Request.create({
        type,
        sender: new mongoose.Types.ObjectId(),
        receiver: new mongoose.Types.ObjectId(),
      });
      expect(request.type).toBe(type);
    }
  });

  test("should reject invalid request type", async () => {
    const request = new Request({
      type: "INVALID_TYPE",
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
    });

    await expect(request.save()).rejects.toThrow();
  });

  test("should accept valid status transitions", async () => {
    const request = await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
    });

    request.status = "accepted";
    await request.save();
    expect(request.status).toBe("accepted");

    request.status = "rejected";
    await request.save();
    expect(request.status).toBe("rejected");
  });

  test("should reject invalid status", async () => {
    const request = new Request({
      type: "DIRECT_CHAT_REQUEST",
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      status: "invalid_status",
    });

    await expect(request.save()).rejects.toThrow();
  });

  test("should support unique partial index on pending requests", async () => {
    const sender = new mongoose.Types.ObjectId();
    const receiver = new mongoose.Types.ObjectId();

    await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender,
      receiver,
    });

    await expect(
      Request.create({
        type: "DIRECT_CHAT_REQUEST",
        sender,
        receiver,
      })
    ).rejects.toThrow();
  });

  test("should allow duplicate after rejection", async () => {
    const sender = new mongoose.Types.ObjectId();
    const receiver = new mongoose.Types.ObjectId();

    const first = await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender,
      receiver,
    });

    first.status = "rejected";
    await first.save();

    const second = await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender,
      receiver,
    });

    expect(second).toBeDefined();
    expect(second.status).toBe("pending");
  });

  test("should mark request as deleted", async () => {
    const request = await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
    });

    request.isDeleted = true;
    await request.save();

    expect(request.isDeleted).toBe(true);
  });

  test("should mark request as read", async () => {
    const request = await Request.create({
      type: "DIRECT_CHAT_REQUEST",
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
    });

    request.isRead = true;
    await request.save();

    expect(request.isRead).toBe(true);
  });
});
