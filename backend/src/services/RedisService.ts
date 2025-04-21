import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("FATAL ERROR: REDIS_URL environment variable is not set.");
  // Throwing here might prevent seeing other logs if it happens early
  // Consider process.exit(1) or just logging and letting connection fail
  throw new Error("REDIS_URL is not set");
}

console.log("Attempting to connect to Redis...");
const redisClient = new Redis(redisUrl);

redisClient.on("connect", () => {
  console.log("Successfully connected to Redis.");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready.");
});

redisClient.on("error", (error: any) => {
  console.error("Redis connection error:", error);
  throw new Error("Failed to connect to Redis");
});

redisClient.on("end", () => {
  console.log("Redis connection closed.");
});

export default redisClient;
