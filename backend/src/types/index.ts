// Example of custom types for the application
export interface AppError extends Error {
  statusCode: number;
  status: string;
}

export interface GameSession {
  id: string;
  wordsTried: {
    word: string;
    wordStatus: string[];
  }[];
  currentRow: number;
  isGameOver: boolean;
  createdAt: Date;
}
