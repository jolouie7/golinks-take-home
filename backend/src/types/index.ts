// Example of custom types for the application
export interface AppError extends Error {
  statusCode: number;
  status: string;
}

// You can add more types as needed for your specific application
