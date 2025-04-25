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

  return secretWord.toUpperCase();
};

export const getSecretWord = async () => {
  const secretWord = await redisClient.get(SECRET_WORD_KEY);
  if (!secretWord) {
    return selectAndLoadNewSecretWord();
  }
  return secretWord.toUpperCase();
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

export const checkLetterStatus = async (
  letter: string,
  position: number
): Promise<string> => {
  const secretWord = await getSecretWord();
  letter = letter.toUpperCase();
  if (!letter) return "absent";

  // If the letter is in the correct position
  if (secretWord[position] === letter) {
    return "correct";
  }

  // If the letter exists in the word but in wrong position
  if (secretWord.includes(letter)) {
    return "present";
  }

  return "absent";
};

export const countVowels = async (): Promise<number> => {
  const secretWord = await getSecretWord();
  const vowels = ["A", "E", "I", "O", "U"];
  let count = 0;
  for (const letter of secretWord) {
    if (vowels.includes(letter)) {
      count++;
    }
  }
  return count;
};
