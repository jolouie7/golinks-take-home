import fs from "fs";
import redisClient from "./RedisService";

const wordList = JSON.parse(fs.readFileSync("data/secret-words.json", "utf8"));
const VALID_WORDS_KEY = "wordle:validWords";
const SECRET_WORD_KEY = "wordle:secretWord";

export const selectAndLoadNewSecretWord = async () => {
  // Pick a random word from the list
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const secretWord = wordList[randomIndex];

  // Secret word in Redis with expiration at midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const secondsUntilMidnight = Math.floor(
    (midnight.getTime() - now.getTime()) / 1000
  );

  await redisClient.set(
    SECRET_WORD_KEY,
    secretWord,
    "EX",
    secondsUntilMidnight
  );

  return secretWord;
};

export const getSecretWord = async () => {
  const secretWord = await redisClient.get(SECRET_WORD_KEY);
  if (!secretWord) {
    return selectAndLoadNewSecretWord();
  }
  return secretWord;
};

export const isValidWord = async (word: string): Promise<boolean> => {
  if (!word || typeof word !== "string") {
    return false;
  }

  const normalizedWord = word.toLowerCase().trim();

  // Check if the word exists in Redis set
  const isValid = await redisClient.sismember(VALID_WORDS_KEY, normalizedWord);
  return Boolean(isValid);
};
