import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import WordleLandingPage from "@/components/WordleLandingPage";
import WordleGameBoard from "@/components/WordleGameBoard";

function App() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/game");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-[#e9e9e9] min-h-screen flex items-center justify-center w-full">
              <WordleLandingPage onPlayClick={handlePlayClick} />
            </div>
          }
        />
        <Route
          path="/game"
          element={
            <div className="bg-[#121213] min-h-screen flex items-center justify-center w-full">
              <WordleGameBoard onBackToHome={handleBackToHome} />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
