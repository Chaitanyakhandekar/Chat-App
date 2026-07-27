import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
import { Chat } from "../../src/models/chat.model.js";
import { User } from "../../src/models/user.model.js";

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
    username: `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "Test User",
    email: `email_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@test.com`,
    password: "password123",
    ...overrides,
  };
  return await User.create(data);
};

describe("Chat Model - Unit Tests", () => {
  describe("Single Chat", () => {
    test("should create a single chat with two participants", async () => {
      const u1 = await createUser();
      const u2 = await createUser();
      const chat = await Chat.create({ participants: [u1._id, u2._id] });
      expect(chat.participants).toHaveLength(2);
      expect(chat.isGroupChat).toBe(false);
    });

    test("should default isGroupChat to false", async () => {
      const u1 = await createUser();
      const u2 = await createUser();
      const chat = await Chat.create({ participants: [u1._id, u2._id] });
      expect(chat.isGroupChat).toBe(false);
    });
  });

  describe("Group Chat", () => {
    test("should create a group chat with isGroupChat=true", async () => {
      const creator = await createUser();
      const group = await Chat.create({
        participants: [creator._id],
        isGroupChat: true,
        groupName: "Test Group",
        createdBy: creator._id,
        admins: [creator._id],
      });
      expect(group.isGroupChat).toBe(true);
      expect(group.groupName).toBe("Test Group");
      expect(group.admins).toHaveLength(1);
    });
  });

  describe("Edge Cases", () => {
    test("should allow empty participants", async () => {
      const chat = await Chat.create({ participants: [] });
      expect(chat.participants).toHaveLength(0);
    });

    test("should handle multiple participants", async () => {
      const users = await Promise.all(Array.from({ length: 5 }, () => createUser()));
      const group = await Chat.create({
        participants: users.map((u) => u._id),
        isGroupChat: true,
        groupName: "Large Group",
        createdBy: users[0]._id,
        admins: [users[0]._id],
      });
      expect(group.participants).toHaveLength(5);
    });

    test("should store lastMessage as object", async () => {
      const u1 = await createUser();
      const u2 = await createUser();
      const chat = await Chat.create({ participants: [u1._id, u2._id] });
      chat.lastMessage = { text: "Hello", sender: u1._id };
      await chat.save();
      expect(chat.lastMessage.text).toBe("Hello");
    });
  });
});
