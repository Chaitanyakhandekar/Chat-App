import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
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

describe("Notification Model - Unit Tests", () => {
  test("should create a valid notification", async () => {
    const n = await Notification.create({
      sender: new mongoose.Types.ObjectId(),
      receivers: [new mongoose.Types.ObjectId()],
      type: "message",
      content: "Test notification",
    });
    expect(n.type).toBe("message");
    expect(n.content).toBe("Test notification");
    expect(n.isRead).toBe(false);
  });

  test("should require content", async () => {
    const n = new Notification({
      sender: new mongoose.Types.ObjectId(),
      receivers: [new mongoose.Types.ObjectId()],
      type: "message",
    });
    await expect(n.save()).rejects.toThrow();
  });

  test("should accept valid types", async () => {
    for (const type of ["group_add", "mention", "message", "admin_promote", "friend_request", "notify"]) {
      const n = await Notification.create({
        sender: new mongoose.Types.ObjectId(),
        receivers: [new mongoose.Types.ObjectId()],
        type,
        content: `Test ${type}`,
      });
      expect(n.type).toBe(type);
    }
  });

  test("should reject invalid type", async () => {
    const n = new Notification({
      sender: new mongoose.Types.ObjectId(),
      receivers: [new mongoose.Types.ObjectId()],
      type: "invalid",
      content: "test",
    });
    await expect(n.save()).rejects.toThrow();
  });

  test("should handle multiple receivers", async () => {
    const n = await Notification.create({
      sender: new mongoose.Types.ObjectId(),
      receivers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      type: "message",
      content: "Broadcast",
    });
    expect(n.receivers).toHaveLength(3);
  });

  test("should support isGroupNotification", async () => {
    const n = await Notification.create({
      sender: new mongoose.Types.ObjectId(),
      receivers: [new mongoose.Types.ObjectId()],
      type: "group_add",
      content: "Group notify",
      isGroupNotification: true,
    });
    expect(n.isGroupNotification).toBe(true);
  });
});
