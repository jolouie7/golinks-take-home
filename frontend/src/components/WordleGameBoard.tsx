import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Delete } from "lucide-react";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { wordList } from "@/wordleWordList";
interface WordleGameBoardProps {
  onBackToHome: () => void;
}

function WordleGameBoard({ onBackToHome }: WordleGameBoardProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [wordsTried, setWordsTried] = useState<string[]>(Array(6).fill(""));
  const [currentWord, setCurrentWord] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [secretWord, setSecretWord] = useState("INBOX");
  const [letterStatus, setLetterStatus] = useState<{
    [key: string]: "correct" | "present" | "absent";
  }>({});
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOver) return;

      const key = event.key.toUpperCase();

      if (key === "ENTER") {
        handleSubmit();
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
  }, [currentWord]);

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

  const isValidWord = (word: string) => {
    return wordList.has(word);
  };

  const handleSubmit = () => {
    if (currentWord.length === 5 && currentRow < 6) {
      if (!isValidWord(currentWord.join(""))) {
        toast.error("Not a valid word");
        return;
      }

      if (checkIfSecretWord(currentWord.join(""))) {
        toast.success("You win!");
        setIsGameOver(true);
      }

      const newWordsTried = [...wordsTried];
      newWordsTried[currentRow] = currentWord.join("");

      // Go through each letter in currentWord update letterStatus
      const newLetterStatus = { ...letterStatus };
      currentWord.forEach((letter, index) => {
        const status = getLetterStatus(letter, index);
        if (
          !letterStatus[letter] ||
          (letterStatus[letter] === "absent" && status !== "absent") || // i don't think a letter ever goes from absent to present or correct
          (letterStatus[letter] === "present" && status === "correct")
        ) {
          newLetterStatus[letter] = status;
        }
      });

      setLetterStatus(newLetterStatus);
      setWordsTried(newWordsTried);
      setCurrentRow(currentRow + 1);
      setCurrentWord([]);
      console.log(wordsTried);
    }

    if (currentRow === 6) {
      toast.error("You lose!");
      setIsGameOver(true);
    }
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
