import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../../src/models/user.model.js";
import { Chat } from "../../src/models/chat.model.js";
import { Message } from "../../src/models/message.model.js";
import { Notification } from "../../src/models/notification.model.js";
import { Request } from "../../src/models/request.model.js";
import supertest from "supertest";

export const createTestUser = async (overrides = {}) => {
  const userData = {
    username: `testuser_${Date.now()}`,
    name: "Test User",
    email: `test_${Date.now()}@example.com`,
    password: "password123",
    ...overrides,
  };

  return await User.create(userData);
};

export const createTestChat = async (participants) => {
  return await Chat.create({
    participants,
    isGroupChat: false,
  });
};

export const createTestGroup = async (creatorId, memberIds = []) => {
  const participants = [creatorId, ...memberIds];
  return await Chat.create({
    participants,
    isGroupChat: true,
    groupName: `Test Group ${Date.now()}`,
    createdBy: creatorId,
    admins: [creatorId],
    groupPicture: "https://example.com/group.jpg",
  });
};

export const createTestMessage = async (overrides = {}) => {
  const defaultData = {
    chatId: new mongoose.Types.ObjectId(),
    sender: new mongoose.Types.ObjectId(),
    receiver: new mongoose.Types.ObjectId(),
    message: "Test message content",
    status: "sent",
  };

  return await Message.create({ ...defaultData, ...overrides });
};

export const createTestNotification = async (overrides = {}) => {
  const defaultData = {
    sender: new mongoose.Types.ObjectId(),
    receivers: [new mongoose.Types.ObjectId()],
    type: "message",
    content: "Test notification",
  };

  return await Notification.create({ ...defaultData, ...overrides });
};

export const createTestRequest = async (overrides = {}) => {
  const defaultData = {
    type: "DIRECT_CHAT_REQUEST",
    sender: new mongoose.Types.ObjectId(),
    receiver: new mongoose.Types.ObjectId(),
    status: "pending",
    message: "friend request",
  };

  return await Request.create({ ...defaultData, ...overrides });
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1d" }
  );
};

export const createAuthenticatedRequest = async (app, userOverrides = {}) => {
  const user = await createTestUser(userOverrides);
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const agent = supertest.agent(app);

  return {
    user,
    accessToken,
    refreshToken,
    agent,
    get: (url) =>
      agent.get(url).set("Cookie", [
        `accessToken=${accessToken}`,
        `refreshToken=${refreshToken}`,
      ]),
    post: (url) =>
      agent.post(url).set("Cookie", [
        `accessToken=${accessToken}`,
        `refreshToken=${refreshToken}`,
      ]),
    put: (url) =>
      agent.put(url).set("Cookie", [
        `accessToken=${accessToken}`,
        `refreshToken=${refreshToken}`,
      ]),
    delete: (url) =>
      agent.delete(url).set("Cookie", [
        `accessToken=${accessToken}`,
        `refreshToken=${refreshToken}`,
      ]),
    patch: (url) =>
      agent.patch(url).set("Cookie", [
        `accessToken=${accessToken}`,
        `refreshToken=${refreshToken}`,
      ]),
  };
};

export const clearDatabase = async () => {
  await Promise.all([
    User.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
    Request.deleteMany({}),
  ]);
};
