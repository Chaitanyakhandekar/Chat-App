import mongoose from "mongoose";
import { jest } from "@jest/globals";

jest.unstable_mockModule("ioredis", () => {
  const RedisMock = (await import("ioredis-mock")).default;
  return { default: RedisMock };
});

jest.unstable_mockModule("../src/redis/config.js", () => ({
  redis: {
    get: jest.fn(() => null),
    set: jest.fn(() => "OK"),
    del: jest.fn(() => 1),
    expire: jest.fn(() => 1),
  },
}));

jest.unstable_mockModule("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(() => ({
        secure_url: "https://res.cloudinary.com/test/image.jpg",
        public_id: "test/image",
        success: true,
      })),
      destroy: jest.fn(() => ({ result: "ok" })),
    },
  },
}));

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: jest.fn(() => ({
      sendMail: jest.fn(() => ({ messageId: "test-msg-id" })),
    })),
  },
}));

afterAll(async () => {
  await mongoose.disconnect();
});
