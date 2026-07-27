import { jest } from "@jest/globals";
import { Server } from "socket.io";
import { createServer } from "http";
import { io as ioc } from "socket.io-client";
import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../helpers/mongoSetup.js";
import { createTestUser } from "../helpers/factory.js";

let httpServer, wsServer, clientSocket;
let PORT;

beforeAll(async () => {
  await connectTestDB();

  httpServer = createServer();
  wsServer = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  const { auth } = await import("../../src/sockets/middleware/auth.middleware.js");
  wsServer.use(auth);

  wsServer.on("connection", (socket) => {
    socket.on("disconnect", () => {});
  });

  await new Promise((resolve) => {
    PORT = 0;
    httpServer.listen(PORT, () => {
      PORT = httpServer.address().port;
      resolve();
    });
  });
});

afterAll(async () => {
  if (clientSocket) {
    clientSocket.removeAllListeners();
    clientSocket.close();
  }
  wsServer.close();
  httpServer.close();
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

const connectClient = (token) => {
  return new Promise((resolve, reject) => {
    const socket = ioc(`http://localhost:${PORT}`, {
      transports: ["websocket"],
      extraHeaders: { cookie: `accessToken=${token}` },
      forceNew: true,
    });
    socket.on("connect", () => resolve(socket));
    socket.on("connect_error", (err) => reject(err));
    setTimeout(() => reject(new Error("Connection timeout")), 3000);
  });
};

describe("WebSocket Authentication Security Tests", () => {
  describe("Connection with Invalid Tokens", () => {
    test("should reject connection without token", async () => {
      const socket = ioc(`http://localhost:${PORT}`, {
        transports: ["websocket"],
        forceNew: true,
      });
      await expect(new Promise((_, reject) => {
        socket.on("connect_error", reject);
        setTimeout(() => reject(new Error("Connection timeout")), 3000);
      })).rejects.toThrow();
    });

    test("should reject connection with malformed token", async () => {
      await expect(connectClient("not-a-valid-jwt")).rejects.toThrow();
    });

    test("should reject connection with expired token", async () => {
      const { default: jwt } = await import("jsonwebtoken");
      const expiredToken = jwt.sign(
        { _id: new mongoose.Types.ObjectId() },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "0s" }
      );
      await expect(connectClient(expiredToken)).rejects.toThrow();
    });

    test("should reject connection with token with wrong secret", async () => {
      const { default: jwt } = await import("jsonwebtoken");
      const fakeToken = jwt.sign(
        { _id: new mongoose.Types.ObjectId() },
        "wrong-secret"
      );
      await expect(connectClient(fakeToken)).rejects.toThrow();
    });

    test("should accept connection with valid token", async () => {
      const user = await createTestUser();
      const { default: jwt } = await import("jsonwebtoken");
      const validToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" }
      );
      const socket = await connectClient(validToken);
      expect(socket.connected).toBe(true);
      socket.close();
    });
  });
});
