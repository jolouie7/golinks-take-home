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
  const gameSession = await redisClient.get("gameSession");
  return gameSession;
};

// TODO: add validation to check incoming gameSession
export const updateGameSession = async (newGameSession: GameSession) => {
  const gameSession = await redisClient.set(
    "gameSession",
    JSON.stringify(newGameSession)
  );
  return gameSession;
};

export const deleteGameSession = async () => {
  const gameSession = await redisClient.del("gameSession");
  return gameSession;
};
