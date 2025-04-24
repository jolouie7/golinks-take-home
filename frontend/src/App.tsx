import { Route, Routes } from "react-router-dom";
import WordleLandingPage from "@/components/WordleLandingPage";
import WordleGameBoard from "@/components/WordleGameBoard";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-[#e9e9e9] min-h-screen flex items-center justify-center w-full">
              <WordleLandingPage />
            </div>
          }
        />
        <Route
          path="/game"
          element={
            <div className="bg-[#121213] min-h-screen flex items-center justify-center w-full">
              <WordleGameBoard />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
