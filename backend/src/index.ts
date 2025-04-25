import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import {
  checkLetterStatus,
  countVowels,
  getSecretWord,
  isValidWord,
} from "./services/WordService";
import {
  getGameSession,
  createGameSession,
  updateGameSession,
  forceStartNewGameWithNewSecretWord,
} from "./services/GameSessionService";

const app = express();
const port = process.env.PORT || 8000;

// CORS Configuration
const allowedOrigins = [
  "https://golinks-take-home.vercel.app",
  "http://localhost:5173",
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

// Apply CORS middleware
app.use(cors(corsOptions));

// Apply JSON middleware *after* CORS
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express TypeScript API" });
});

// New game
app.get("/api/new-game-session", async (req: Request, res: Response) => {
  const newGameSession = await createGameSession();
  if (newGameSession) {
    res.json(newGameSession);
  } else {
    res.status(500).json({ error: "Failed to create game session" });
  }
});

// Get current game session
app.get("/api/game-session", async (req: Request, res: Response) => {
  console.log("Entered GET /api/game-session handler try block.");
  try {
    console.log("GET /api/game-session route handler started.");
    const gameSessionString = await getGameSession();
    if (!gameSessionString) {
      return res.status(404).json({ error: "Game session not found" });
    }

    try {
      const gameSession = JSON.parse(gameSessionString);
      res.json(gameSession);
    } catch (error) {
      res.status(500).json({ error: "Failed to parse game session" });
    }
  } catch (error: any) {
    console.error(
      "Caught error inside GET /api/game-session handler catch block:",
      error
    );
    res.status(500).json({ error: "Failed to get game session" });
  }
});

// Update game session
app.put("/api/game-session", async (req: Request, res: Response) => {
  const newGameSession = req.body;
  await updateGameSession(newGameSession);
  res.json(newGameSession);
});

// Check if word is valid
app.post("/api/is-valid-word", async (req: Request, res: Response) => {
  const word = req.body.word;
  const isValid = await isValidWord(word);
  res.json(isValid);
});

// Check if letter is in the secret word
app.post("/api/is-secret-word", async (req: Request, res: Response) => {
  const secretWord = await getSecretWord();
  const word = req.body.word;
  if (word === secretWord) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// Get number of vowels in secret word
app.get("/api/vowel-count", async (req: Request, res: Response) => {
  const numberOfVowels = await countVowels();
  res.json({ count: numberOfVowels });
});

app.post("/api/check-letter-status", async (req: Request, res: Response) => {
  const letter = req.body.letter;
  const position = req.body.index;
  const letterStatus = await checkLetterStatus(letter, position);
  res.json(letterStatus);
});

// Get secret word
app.get("/api/secret-word", async (req: Request, res: Response) => {
  const secretWord = await getSecretWord();
  res.json({ secretWord });
});

// Forces new game and new secret word
app.get("/api/force-new-game", async (req: Request, res: Response) => {
  const newGameSession = await forceStartNewGameWithNewSecretWord();
  res.json(newGameSession);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});
