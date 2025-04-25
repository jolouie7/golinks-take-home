import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Delete } from "lucide-react";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const apiUrl = import.meta.env.VITE_API_URL;

interface WordTried {
  word: string;
  wordStatus: string[];
}

interface GameSession {
  id: string;
  wordsTried: WordTried[];
  currentRow: number;
  isGameOver: boolean;
}

function WordleGameBoard() {
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [gameSessionId, setGameSessionId] = useState("");
  const [wordsTried, setWordsTried] = useState<
    {
      word: string;
      wordStatus: string[];
    }[]
  >(Array(6).fill({ word: "", wordStatus: [] }));
  const [currentWord, setCurrentWord] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [letterStatus, setLetterStatus] = useState<{
    [key: string]: "correct" | "present" | "absent";
  }>({});

  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const getGameSession = async () => {
      try {
        const gameSession = await fetch(`${apiUrl}/api/game-session`);

        if (!gameSession.ok) {
          const newGameSession = await fetch(`${apiUrl}/api/new-game-session`);
          const newGameSessionData = await newGameSession.json();
          setGameSessionId(newGameSessionData.id);
          setWordsTried(newGameSessionData.wordsTried);
          setCurrentRow(newGameSessionData.currentRow);
          setIsGameOver(newGameSessionData.isGameOver);
          return;
        }

        const gameSessionData = await gameSession.json();

        setGameSessionId(gameSessionData.id);
        setWordsTried(gameSessionData.wordsTried);
        setCurrentRow(gameSessionData.currentRow);
        setIsGameOver(gameSessionData.isGameOver);

        // Initialize keyboard letter status based on words tried
        const newLetterStatus: {
          [key: string]: "correct" | "present" | "absent";
        } = {};

        // Process each word that has been tried
        gameSessionData.wordsTried.forEach(
          (wordData: { word: string; wordStatus: string[] }) => {
            if (
              wordData.word &&
              wordData.wordStatus &&
              wordData.wordStatus.length > 0
            ) {
              for (let i = 0; i < wordData.word.length; i++) {
                const letter = wordData.word[i].toUpperCase();
                const status = wordData.wordStatus[i] as
                  | "correct"
                  | "present"
                  | "absent";

                // Only update if the new status is better than existing
                if (
                  !newLetterStatus[letter] ||
                  (newLetterStatus[letter] === "absent" &&
                    status !== "absent") ||
                  (newLetterStatus[letter] === "present" &&
                    status === "correct")
                ) {
                  newLetterStatus[letter] = status;
                }
              }
            }
          }
        );

        setLetterStatus(newLetterStatus);
      } catch (error) {
        console.error("Error fetching game session:", error);
        toast.error("Failed to load game session");
      }
    };

    getGameSession();
  }, []);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (isGameOver) return;

      const key = event.key.toUpperCase();

      if (key === "ENTER") {
        await handleSubmit();
      } else if (key === "BACKSPACE" || key === "DELETE") {
        handleDelete();
      } else if (/^[A-Z]$/.test(key) && currentWord.length < 5) {
        handleLetterClick(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentWord, isGameOver]);

  const handleCloseModal = () => {
    setShowHowToPlay(false);
  };

  const handleLetterClick = (letter: string) => {
    if (isGameOver) return;

    if (currentWord.length < 5) {
      setCurrentWord([...currentWord, letter]);
    }
  };

  const handleDelete = () => {
    if (currentWord.length > 0) {
      setCurrentWord(currentWord.slice(0, -1));
    }
  };

  const isSecretWord = async (word: string): Promise<boolean> => {
    try {
      const response = await fetch(`${apiUrl}/api/is-secret-word`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error checking if word is secret:", error);
      toast.error("Failed to check word");
      return false;
    }
  };

  const isValidWord = async (word: string): Promise<boolean> => {
    if (!apiUrl) {
      console.error("Error: VITE_API_URL environment variable not set.");
      toast.error("API URL not configured. Please contact support.");
      return false;
    }

    try {
      const response = await fetch(`${apiUrl}/api/is-valid-word`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error validating word:", error);
      toast.error("Failed to validate word");
      return false;
    }
  };

  const updateGameSession = async (newGameSession: GameSession) => {
    if (!apiUrl) {
      console.error("Error: VITE_API_URL environment variable not set.");
      toast.error("API URL not configured. Cannot save game.");
      return null;
    }

    try {
      const response = await fetch(`${apiUrl}/api/game-session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGameSession),
      });

      // Get the updated game session with wordStatus filled by backend
      return await response.json();
    } catch (error) {
      console.error("Error updating game session:", error);
      toast.error("Failed to update game");
      return null;
    }
  };

  const handleGameEnd = async (wordToCheck: string) => {
    // Update the words tried array first to ensure the word appears on the board
    const newWordsTried = [...wordsTried];
    newWordsTried[currentRow] = { word: wordToCheck, wordStatus: [] };
    setWordsTried(newWordsTried);

    setIsGameOver(true);

    // Update game session with the updated state
    const currentGameSession = {
      id: gameSessionId,
      wordsTried: newWordsTried,
      currentRow: currentRow + 1,
      isGameOver: true,
    };

    const updatedSession = await updateGameSession(currentGameSession);
    if (updatedSession) {
      setWordsTried(updatedSession.wordsTried);
      setCurrentRow(updatedSession.currentRow);
      setIsGameOver(updatedSession.isGameOver);
      setCurrentWord([]);
      updateLetterStatus(
        wordToCheck,
        updatedSession.wordsTried[currentRow]?.wordStatus || []
      );
    }
  };

  const handleSubmit = async () => {
    const wordToCheck = currentWord.join("");

    if (currentWord.length !== 5 || isGameOver) {
      return;
    }

    // Check if the word is correct
    if (await isSecretWord(wordToCheck)) {
      await handleGameEnd(wordToCheck);
      toast.success("You win!");
      return;
    }

    // The user didn't get the secret word
    // If we are on the last row (0 based indexing)
    if (currentRow === 5) {
      await handleGameEnd(wordToCheck);

      try {
        const secretWord = await fetch(`${apiUrl}/api/secret-word`);
        const secretWordData = await secretWord.json();
        toast.error(`Game Over! Secret Word was ${secretWordData.secretWord}`);
      } catch (error) {
        console.error("Error fetching secret word:", error);
        toast.error("Game Over!");
      }
      return;
    }

    const isValid = await isValidWord(wordToCheck);
    if (!isValid) {
      toast("Not a valid word");
      return;
    }

    // Update the words tried array first to ensure the word appears on the board
    const newWordsTried = [...wordsTried];
    newWordsTried[currentRow] = { word: wordToCheck, wordStatus: [] };
    setWordsTried(newWordsTried);

    // Update game session
    const currentGameSession = {
      id: gameSessionId,
      wordsTried: newWordsTried,
      currentRow: currentRow + 1,
      isGameOver: isGameOver,
    };

    const updatedSession = await updateGameSession(currentGameSession);
    if (updatedSession) {
      setWordsTried(updatedSession.wordsTried);
      setCurrentRow(updatedSession.currentRow);
      setIsGameOver(updatedSession.isGameOver);
      setCurrentWord([]);
      updateLetterStatus(
        wordToCheck,
        updatedSession.wordsTried[currentRow]?.wordStatus || []
      );
    }
  };

  const handleClickStartNewGameAndGetNewSecretWord = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/force-new-game`);
      const data = await res.json();

      setWordsTried(data.wordsTried);
      setCurrentRow(data.currentRow);
      setIsGameOver(data.isGameOver);
      setCurrentWord([]);
      setLetterStatus({});
    } catch (error) {
      console.error("Error starting new game:", error);
      toast.error("Failed to start new game");
    }
  };

  const getNumberOfVowels = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/vowel-count`);
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error("Error getting vowel count:", error);
      return null;
    }
  };

  const getHint = async () => {
    const numberOfVowels = await getNumberOfVowels();
    if (numberOfVowels !== null) {
      toast(`Number of vowels in the secret word: ${numberOfVowels}`);
    } else {
      toast.error("Couldn't get hint right now");
    }
  };

  const updateLetterStatus = (word: string, wordStatus: string[]) => {
    const newLetterStatus = { ...letterStatus };

    for (let i = 0; i < word.length; i++) {
      const letter = word[i].toUpperCase();
      const status = wordStatus[i] as "correct" | "present" | "absent";

      // Only update if the new status is better than existing
      if (
        !newLetterStatus[letter] ||
        (newLetterStatus[letter] === "absent" && status !== "absent") ||
        (newLetterStatus[letter] === "present" && status === "correct")
      ) {
        newLetterStatus[letter] = status;
      }
    }

    setLetterStatus(newLetterStatus);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#121213] text-white">
      {/* How To Play Modal */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={handleCloseModal} />

      {/* Header */}
      <header className="w-full border-b border-gray-700 p-3 flex justify-between items-center ">
        <Link to="/">
          <button onClick={handleBackToHome} className="p-2">
            <ArrowLeft />
          </button>
        </Link>
        <div className="flex gap-2">
          <Button
            className="cursor-pointer"
            onClick={getHint}
            variant={"secondary"}
          >
            Get Hint
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleClickStartNewGameAndGetNewSecretWord}
            disabled={!isGameOver}
            variant={"secondary"}
          >
            New Game
          </Button>
        </div>
      </header>

      {/* Game Board - 5x6 grid */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-rows-6 gap-1 mb-6">
          {[...Array(6)].map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-1">
              {[...Array(5)].map((_, colIndex) => {
                // Get the word data for this row
                const wordData = wordsTried[rowIndex];
                let letter = "";

                // For completed rows, get letter and status from wordsTried
                if (wordData && wordData.word && wordData.word[colIndex]) {
                  letter = wordData.word[colIndex];
                }
                // For current row being typed, get letter from currentWord
                else if (
                  rowIndex === currentRow &&
                  colIndex < currentWord.length
                ) {
                  letter = currentWord[colIndex];
                }

                // Determine the status for styling
                const status = wordData?.wordStatus?.[colIndex] || "";

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn(
                      "w-14 h-14 md:w-16 md:h-16 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold",
                      {
                        "bg-green-700 border-green-700": status === "correct",
                        "bg-yellow-700 border-yellow-700": status === "present",
                        "bg-gray-700 border-gray-700": status === "absent",
                      }
                    )}
                  >
                    {letter.toUpperCase()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-md px-2 pb-8">
        <div className="flex justify-center mb-2">
          {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
            (letter, idx) => (
              <button
                key={idx}
                className={cn(
                  "w-8 h-10 md:w-10 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center",
                  letterStatus[letter] === "correct" &&
                    "bg-green-700 border-green-700",
                  letterStatus[letter] === "present" &&
                    "bg-yellow-700 border-yellow-700",
                  letterStatus[letter] === "absent" &&
                    "bg-gray-700 border-gray-700"
                )}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </button>
            )
          )}
        </div>
        <div className="flex justify-center mb-2">
          {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter, idx) => (
            <button
              key={idx}
              className={cn(
                "w-8 h-10 md:w-10 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center",
                letterStatus[letter] === "correct" &&
                  "bg-green-700 border-green-700",
                letterStatus[letter] === "present" &&
                  "bg-yellow-700 border-yellow-700",
                letterStatus[letter] === "absent" &&
                  "bg-gray-700 border-gray-700"
              )}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            className="w-14 h-10 md:w-16 md:h-14 bg-gray-500 text-white text-xs font-bold rounded m-0.5 flex items-center justify-center"
            onClick={handleSubmit}
          >
            ENTER
          </button>
          {["Z", "X", "C", "V", "B", "N", "M"].map((letter, idx) => (
            <button
              key={idx}
              className={cn(
                "w-8 h-10 md:w-10 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center",
                letterStatus[letter] === "correct" &&
                  "bg-green-700 border-green-700",
                letterStatus[letter] === "present" &&
                  "bg-yellow-700 border-yellow-700",
                letterStatus[letter] === "absent" &&
                  "bg-gray-700 border-gray-700"
              )}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
          <button
            className="w-14 h-10 md:w-16 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center"
            onClick={handleDelete}
          >
            <Delete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordleGameBoard;
