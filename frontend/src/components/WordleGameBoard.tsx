import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Delete } from "lucide-react";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WordleGameBoardProps {
  onBackToHome: () => void;
}

function WordleGameBoard({ onBackToHome }: WordleGameBoardProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [gameSessionId, setGameSessionId] = useState("");
  const [wordsTried, setWordsTried] = useState<string[]>(Array(6).fill(""));
  const [currentWord, setCurrentWord] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [secretWord, setSecretWord] = useState("");
  const [letterStatus, setLetterStatus] = useState<{
    [key: string]: "correct" | "present" | "absent";
  }>({});
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const getGameSession = async () => {
      /*
      1a. check localstorage for game session, if there is a game session then get that game session
      1b. if there is no game session then make an api call to get new game session
      2. make an api call to get the game session and store in component state
      returns:
      {
    "id": "4c78bb55-a9bd-46f0-897a-639d47712469",
    "secretWord": "INBOX",
    "wordsTried": [
        "INPUT",
        "PILOT",
        "",
        "",
        "",
        ""
    ],
    "currentRow": 2,
    "isGameOver": false,
    "createdAt": "2025-04-21T07:07:21.977Z"
}

      3. once the state is loaded the board and keyboard should be rendered correctly
      */

      const gameSession = await fetch(
        `${import.meta.env.VITE_API_URL}/api/game-session`
      );

      if (!gameSession) {
        const newGameSession = await fetch(
          `${import.meta.env.VITE_API_URL}/api/new-game-session`
        );
        const newGameSessionData = await newGameSession.json();
        setGameSessionId(newGameSessionData.id);
        setSecretWord(newGameSessionData.secretWord);
        setWordsTried(newGameSessionData.wordsTried);
        setCurrentRow(newGameSessionData.currentRow);
        setIsGameOver(newGameSessionData.isGameOver);
      }

      const gameSessionData = await gameSession.json();

      setGameSessionId(gameSessionData.id);
      setSecretWord(gameSessionData.secretWord);
      setWordsTried(gameSessionData.wordsTried);
      setCurrentRow(gameSessionData.currentRow);
      setIsGameOver(gameSessionData.isGameOver);

      // Update keyboard letter status based on words tried
      const newLetterStatus: {
        [key: string]: "correct" | "present" | "absent";
      } = {};

      // Process each word that has been tried
      gameSessionData.wordsTried.forEach((word: string, rowIndex: number) => {
        if (word && rowIndex < gameSessionData.currentRow) {
          for (let i = 0; i < word.length; i++) {
            const letter = word[i].toUpperCase();
            const status = getLetterStatusForKeyboard(
              letter,
              i,
              gameSessionData.secretWord
            );

            // Only update if the new status is better than existing
            if (
              !newLetterStatus[letter] ||
              (newLetterStatus[letter] === "absent" && status !== "absent") ||
              (newLetterStatus[letter] === "present" && status === "correct")
            ) {
              newLetterStatus[letter] = status;
            }
          }
        }
      });

      setLetterStatus(newLetterStatus);
    };

    getGameSession();
  }, []);

  // Helper function to determine letter status for keyboard
  const getLetterStatusForKeyboard = (
    letter: string,
    position: number,
    secret: string
  ) => {
    if (!letter) return "absent";

    if (secret[position] === letter) {
      return "correct";
    }

    if (secret.includes(letter)) {
      return "present";
    }

    return "absent";
  };

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
    console.log(currentWord);
  };

  const handleDelete = () => {
    if (currentWord.length > 0) {
      setCurrentWord(currentWord.slice(0, -1));
    }
    console.log(currentWord);
  };

  // Helper function to check if the word is the secret word
  const checkIfSecretWord = (word: string) => {
    return word === secretWord;
  };

  // Helper function to determine letter status
  const getLetterStatus = (letter: string, position: number) => {
    if (!letter) return "absent";

    // If the letter is in the correct position
    if (secretWord[position] === letter) {
      return "correct";
    }

    // If the letter exists in the word but in wrong position
    if (secretWord.includes(letter)) {
      return "present";
    }

    return "absent";
  };

  const isValidWord = async (word: string): Promise<boolean> => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("Error: VITE_API_URL environment variable not set.");
      toast.error("API URL not configured. Please contact support.");
      return false; // Indicate failure
    }
    const response = await fetch(`${apiUrl}/api/guess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });
    const data = await response.json();
    return data.isValid;
  };

  interface GameSession {
    id: string;
    secretWord: string;
    wordsTried: string[];
    currentRow: number;
    isGameOver: boolean;
  }

  const updateGameSession = async (newGameSession: GameSession) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("Error: VITE_API_URL environment variable not set.");
      toast.error("API URL not configured. Cannot save game.");
      // Decide how to handle this - maybe prevent further gameplay?
      return;
    }
    await fetch(`${apiUrl}/api/game-session`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newGameSession }),
    });
  };

  const handleSubmit = async () => {
    if (currentWord.length !== 5) {
      return;
    }

    if (currentRow >= 6) {
      // Update game session
      const currentGameSession = {
        id: gameSessionId,
        secretWord: secretWord,
        wordsTried: wordsTried,
        currentRow: currentRow + 1,
        isGameOver: true,
      };

      await updateGameSession(currentGameSession);

      toast.error("Game Over!");
      setIsGameOver(true);
    }

    const wordToCheck = currentWord.join("");

    // Check if the word is correct
    if (checkIfSecretWord(wordToCheck)) {
      // Update game session
      const currentGameSession = {
        id: gameSessionId,
        secretWord: secretWord,
        wordsTried: wordsTried,
        currentRow: currentRow + 1,
        isGameOver: true,
      };

      await updateGameSession(currentGameSession);

      // Update letter status for the winning word
      // const newLetterStatus = { ...letterStatus };
      // currentWord.forEach((letter) => {
      //   newLetterStatus[letter] = "correct";
      // });
      // setLetterStatus(newLetterStatus);

      toast.success("You win!");
      setIsGameOver(true);
    }

    // Check if the word is valid
    const isValid = await isValidWord(wordToCheck);
    if (!isValid) {
      toast.error("Not a valid word");
      return;
    }

    // Update the words tried array first to ensure the word appears on the board
    const newWordsTried = [...wordsTried];
    newWordsTried[currentRow] = wordToCheck;
    setWordsTried(newWordsTried);

    // Update game session
    const currentGameSession = {
      id: gameSessionId,
      secretWord: secretWord,
      wordsTried: newWordsTried,
      currentRow: currentRow + 1,
      isGameOver: isGameOver,
    };

    await updateGameSession(currentGameSession);

    // Update letter status for keyboard
    const newLetterStatus = { ...letterStatus };
    currentWord.forEach((letter, index) => {
      const status = getLetterStatus(letter, index);
      if (
        !letterStatus[letter] ||
        (letterStatus[letter] === "absent" && status !== "absent") ||
        (letterStatus[letter] === "present" && status === "correct")
      ) {
        newLetterStatus[letter] = status;
      }
    });

    setLetterStatus(newLetterStatus);
    setCurrentRow(currentRow + 1);
    setCurrentWord([]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#121213] text-white">
      {/* How To Play Modal */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={handleCloseModal} />

      {/* Header */}
      <header className="w-full border-b border-gray-700 p-3 flex justify-start items-center ">
        <Link to="/">
          <button onClick={onBackToHome} className="p-2">
            <ArrowLeft />
          </button>
        </Link>
      </header>

      {/* Game Board - 5x6 grid */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-rows-6 gap-1 mb-6">
          {[...Array(6)].map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-1">
              {[...Array(5)].map((_, colIndex) => {
                // Check if this row has a word tried
                const word = wordsTried[rowIndex];
                let letter = word ? word[colIndex] : "";

                // If this is the current row and we're typing, show the current word
                if (rowIndex === currentRow && colIndex < currentWord.length) {
                  letter = currentWord[colIndex];
                }

                // Determine letter status for coloring
                let letterStatus = "absent";
                if (rowIndex < currentRow && letter) {
                  letterStatus = getLetterStatus(letter, colIndex);
                }

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn(
                      "w-14 h-14 md:w-16 md:h-16 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold",
                      rowIndex < currentRow &&
                        letter && {
                          "bg-green-700 border-green-700":
                            letterStatus === "correct",
                          "bg-yellow-700 border-yellow-700":
                            letterStatus === "present",
                          "bg-gray-700 border-gray-700":
                            letterStatus === "absent",
                        }
                    )}
                  >
                    {letter && letter.toUpperCase()}
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
