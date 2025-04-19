import { useState } from "react";
import "./App.css";
import WordleLandingPage from "@/components/WordleLandingPage";
import WordleGameBoard from "@/components/WordleGameBoard";

function App() {
  const [showGameBoard, setShowGameBoard] = useState(false);

  const handlePlayClick = () => {
    setShowGameBoard(true);
  };

  const handleBackToHome = () => {
    setShowGameBoard(false);
  };

  return (
    <div
      className={`min-h-screen ${
        showGameBoard ? "bg-[#121213]" : "bg-[#e9e9e9]"
      } flex items-center justify-center`}
    >
      {showGameBoard ? (
        <WordleGameBoard onBackToHome={handleBackToHome} />
      ) : (
        <WordleLandingPage onPlayClick={handlePlayClick} />
      )}
    </div>
  );
}

export default App;
