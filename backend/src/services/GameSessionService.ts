import redisClient from "./RedisService";
import { v4 as uuidv4 } from "uuid";
import { GameSession } from "../types";
import { getSecretWord } from "./WordService";

export const createGameSession = async () => {
  // Fetch the secret word asynchronously
  const secretWord = await getSecretWord();

  // Define the new game session structure
  const newGameSession: GameSession = {
    id: uuidv4(),
    secretWord: secretWord,
    wordsTried: ["", "", "", "", "", ""],
    currentRow: 0,
    isGameOver: false,
    createdAt: new Date(),
  };

  try {
    // Set the game session in Redis
    const result = await redisClient.set(
      "gameSession",
      JSON.stringify(newGameSession)
    );

    if (result !== "OK") {
      console.error("Failed to set game session in Redis:", result);
      throw new Error("Failed to create game session in storage.");
    }

    return newGameSession;
  } catch (error) {
    console.error("Error creating game session:", error);
    return null;
  }
};

export const getGameSession = async () => {
  try {
    console.log(
      "getGameSession: Attempting to get 'gameSession' from Redis..."
    );
    if (
      typeof redisClient.status !== "string" ||
      redisClient.status !== "ready"
    ) {
      console.warn(
        `getGameSession: Redis client status is not ready: ${redisClient.status}`
      );
    }

    const gameSession = await redisClient.get("gameSession");
    console.log(
      `getGameSession: Redis returned for 'gameSession': ${
        typeof gameSession === "string"
          ? gameSession.substring(0, 50) + "..."
          : typeof gameSession
      }`
    );
    return gameSession;
  } catch (error) {
    console.error(
      "getGameSession: Error retrieving game session from Redis:",
      error
    );
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
    await deleteGameSession();

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
