import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set");
}

const redisClient = new Redis(process.env.REDIS_URL);

export default redisClient;
