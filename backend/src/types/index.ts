// Example of custom types for the application
export interface AppError extends Error {
  statusCode: number;
  status: string;
}

export interface GameSession {
  id: string;
  secretWord: string;
  wordsTried: string[];
  currentRow: number;
  isGameOver: boolean;
  createdAt: Date;
}
