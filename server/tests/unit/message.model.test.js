import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
import { Message } from "../../src/models/message.model.js";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Message Model - Unit Tests", () => {
  test("should create a valid message", async () => {
    const message = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "Hello, World!",
    });
    expect(message.status).toBe("sent");
    expect(message.message).toBe("Hello, World!");
  });

  test("status transitions should work", async () => {
    const m = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "status test",
    });
    m.status = "delivered"; await m.save();
    expect(m.status).toBe("delivered");
    m.status = "seen"; m.seenAt = new Date(); await m.save();
    expect(m.status).toBe("seen");
  });

  test("should reject invalid status", async () => {
    const m = new Message({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "test",
      status: "invalid_status",
    });
    await expect(m.save()).rejects.toThrow();
  });

  test("should handle reactions", async () => {
    const m = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "React",
    });
    m.reactions.push({ emoji: "👍", user: new mongoose.Types.ObjectId() });
    await m.save();
    expect(m.reactions).toHaveLength(1);
  });

  test("should handle replies", async () => {
    const original = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "Original",
    });
    const reply = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "Reply",
      isReply: true,
      reply: { messageId: original._id, message: original.message },
    });
    expect(reply.isReply).toBe(true);
    expect(reply.reply.message).toBe("Original");
  });

  test("deleteForEveryone flag", async () => {
    const m = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "delete me",
    });
    m.deleteForEveryone = true;
    await m.save();
    expect(m.deleteForEveryone).toBe(true);
  });

  test("deletedFor array", async () => {
    const uid = new mongoose.Types.ObjectId();
    const m = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "delete for me",
    });
    m.deletedFor.push(uid);
    await m.save();
    expect(m.deletedFor).toHaveLength(1);
  });

  test("should store attachments", async () => {
    const m = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "attachment",
      attachments: [{ secure_url: "https://pic.jpg", public_id: "pic123" }],
    });
    expect(m.attachments).toHaveLength(1);
    expect(m.attachments[0].secure_url).toBe("https://pic.jpg");
  });

  test("should fail without chatId", async () => {
    const m = new Message({ sender: new mongoose.Types.ObjectId(), message: "no chat" });
    await expect(m.save()).rejects.toThrow();
  });

  test("should support indicator messages", async () => {
    const m = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      message: "Joined group",
      isIndicator: true,
    });
    expect(m.isIndicator).toBe(true);
  });

  test("should support seenBy array", async () => {
    const m = await Message.create({
      chatId: new mongoose.Types.ObjectId(),
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      message: "seen test",
    });
    m.seenBy.push(new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId());
    await m.save();
    expect(m.seenBy).toHaveLength(2);
  });
});
