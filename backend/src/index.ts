import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import { getSecretWord, isValidWord } from "./services/WordService";
import {
  getGameSession,
  createGameSession,
  updateGameSession,
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
  const secretWord = await getSecretWord();
  const newGameSession = await createGameSession(secretWord);
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

// Guess word
app.post("/api/guess", async (req: Request, res: Response) => {
  const { word } = req.body;
  const isValid = await isValidWord(word);
  res.json({ isValid });
});

// Update game session
app.put("/api/game-session", async (req: Request, res: Response) => {
  const newGameSession = req.body.newGameSession;
  await updateGameSession(newGameSession);
  res.json({ message: "Game session updated" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});
