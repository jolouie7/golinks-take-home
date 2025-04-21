import redisClient from "./RedisService";
import { v4 as uuidv4 } from "uuid";
import { GameSession } from "../types";

export const createGameSession = async (secretWord: string) => {
  const gameSession = await redisClient.set(
    "gameSession",
    JSON.stringify({
      id: uuidv4(),
      secretWord,
      wordsTried: ["", "", "", "", "", ""],
      currentRow: 0,
      isGameOver: false,
      createdAt: new Date(),
    })
  );
  return gameSession;
};

export const getGameSession = async () => {
  try {
    console.log("Attempting to get 'gameSession' from Redis...");
    if (
      typeof redisClient.status !== "string" ||
      redisClient.status !== "ready"
    ) {
      console.warn(`Redis client status is not ready: ${redisClient.status}`);
    }

    const gameSession = await redisClient.get("gameSession");
    console.log(
      `Redis returned for 'gameSession': ${
        typeof gameSession === "string"
          ? gameSession.substring(0, 50) + "..."
          : gameSession
      }`
    );
    return gameSession;
  } catch (error) {
    console.error("Error retrieving game session from Redis:", error);
    return null;
  }
};

// TODO: add validation to check incoming gameSession
export const updateGameSession = async (newGameSession: GameSession) => {
  if (!newGameSession) {
    console.error("Game session data is required", newGameSession);
    throw new Error("Game session data is required");
  }

  try {
    const res = await deleteGameSession();

    const result = await redisClient.set(
      "gameSession",
      JSON.stringify(newGameSession)
    );

    if (result !== "OK") {
      throw new Error(`Failed to update game session: ${result}`);
    }
    return result;
  } catch (error) {
    console.error("Error updating game session:", error);
    throw error;
  }
};

export const deleteGameSession = async () => {
  const gameSession = await redisClient.del("gameSession");
  return gameSession;
};
