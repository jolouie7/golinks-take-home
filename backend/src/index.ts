import express, { Request, Response } from "express";
import cors from "cors";
import { getSecretWord } from "./services/WordService";

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express TypeScript API" });
});

// New game
app.get("/api/new", async (req, res) => {
  const secretWord = await getSecretWord();
  res.json({ secretWord });
});

// Guess word
app.post("/api/guess", (req, res) => {
  console.log("Guess word");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
