import redisClient from "./RedisService";
import { v4 as uuidv4 } from "uuid";
import { GameSession } from "../types";

export const createGameSession = async (secretWord: string) => {
  const gameSession = await redisClient.set(
    "gameSession",
    JSON.stringify({
      id: uuidv4(),
      secretWord,
      wordsTried: ["INPUT", "PILOT", "", "", "", ""], // replace with empty strings as default
      currentRow: 2, // replace with 0 as default
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

// export const updateGameSession = async (gameSession: GameSession) => {
//   const gameSession = await redisClient.set(
//     "gameSession",
//     JSON.stringify(gameSession)
//   );
//   return gameSession;
// };
