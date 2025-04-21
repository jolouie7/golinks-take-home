# Golinks Take-Home Project: Wordle Clone

This is a take-home project implementing the popular game Wordle.

**Live Demo:** [https://golinks-take-home.vercel.app/](https://golinks-take-home.vercel.app/) (Frontend deployed on Vercel, Backend deployed on Railway)

## ✨ Features

- Wordle gameplay: Guess the 5-letter secret word in 6 tries.
- Daily Secret Word: The backend fetches and stores a secret word daily using Redis.
- Input Validation: Checks if guessed words are valid dictionary words.
- Game State Management: Tracks guesses, current row, and game over status, persisted in Redis.
- Responsive UI: Designed to work on different screen sizes (using Tailwind CSS).

## 🛠️ Tech Stack

- **Frontend:**
  - Vite React
  - TypeScript
  - React Router
  - Tailwind CSS
  - Shadcn UI
- **Backend:**
  - Node.js
  - Express
  - TypeScript
  - Redis
- **Deployment:**
  - Frontend: Vercel
  - Backend: Railway

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)
- A running [Redis](https://redis.io/docs/getting-started/installation/) instance (local or cloud-based like Redis Cloud, Upstash, etc.)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/jolouie7/golinks-take-home.git
    cd golinks-take-home
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Configure Backend Environment:**

    - Create a `.env` file in the `backend` directory:
      ```bash
      touch .env
      ```
    - Add your Redis connection URL to the `backend/.env` file:
      ```env
      # Example for local Redis instance
      REDIS_URL=redis://localhost:6379
      ```
      _(Replace with your actual Redis connection string)_

4.  **Install Frontend Dependencies:**

    ```bash
    # Navigate from backend to frontend
    cd ../frontend
    npm install
    ```

5.  **Configure Frontend Environment (Optional but Recommended):**
    - While the frontend might currently use a relative path or a hardcoded URL for the API, it's best practice to use environment variables. Create a `.env` file in the `frontend` directory:
      ```bash
      touch .env
      ```
    - Add the backend API base URL (Vite requires the `VITE_` prefix):
      ```env
      VITE_API_BASE_URL=http://localhost:8000/api
      ```
    - _Note: Ensure your frontend code (e.g., fetch calls) uses `import.meta.env.VITE_API_BASE_URL` to access this variable._

### Running Locally

You'll need two terminals open simultaneously: one for the backend and one for the frontend.

1.  **Run the Backend Server:**

    ```bash
    # In the /backend directory
    npm run dev
    ```

    The backend server should start, typically on port 8000. Look for "Server running on port 8000" and Redis connection messages.

2.  **Run the Frontend Development Server:**

    ```bash
    # In the /frontend directory
    npm run dev
    ```

    The frontend development server (Vite) will start, usually on port 5173.

3.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 💡 Future Improvements & Considerations

This section outlines potential areas for enhancement, demonstrating awareness of best practices and potential next steps.

- **Testing:** Implement unit and integration tests for both frontend components and backend services/API endpoints (e.g., using Jest, Vitest, React Testing Library).
- **UI Enhancements:**
  - Add animations for tile flips and invalid guesses.
  - Implement a virtual keyboard for input.
  - Improve visual feedback for winning/losing states.
- **Error Handling:** Enhance frontend error handling to display user-friendly messages for API errors or network issues.
- **Security:** Review potential security considerations (e.g., rate limiting API endpoints).
- **Statistics:** Track user statistics (win streak, guess distribution).
- **Authentication:** Add authentication to allow users to save their game progress.
