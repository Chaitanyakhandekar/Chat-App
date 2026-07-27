import { MongoMemoryServer } from "mongodb-memory-server";
import { config } from "dotenv";

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_ACCESS_SECRET = "test-access-secret-for-testing-only";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-for-testing-only";
  process.env.EXPIRES_IN_ACCESS_TOKEN = "1h";
  process.env.EXPIRES_IN_REFRESH_TOKEN = "1d";
  process.env.NODE_ENV = "test";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.CLOUDINARY_CLOUD_NAME = "test";
  process.env.CLOUDINARY_API_KEY = "test";
  process.env.CLOUDINARY_API_SECRET = "test";

  global.__MONGOD__ = mongod;
}
