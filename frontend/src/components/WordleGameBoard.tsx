import React from "react";

interface WordleGameBoardProps {
  onBackToHome: () => void;
}

function WordleGameBoard({ onBackToHome }: WordleGameBoardProps) {
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#121213] text-white">
      {/* Header */}
      <header className="w-full border-b border-gray-700 p-3 flex justify-between items-center">
        <button onClick={onBackToHome} className="text-white p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="flex space-x-3">
          <button className="text-white p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          <button className="text-white p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </button>
          <button className="text-white p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Game Board - 5x6 grid */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-rows-6 gap-1 mb-6">
          {[...Array(6)].map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-1">
              {[...Array(5)].map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="w-14 h-14 md:w-16 md:h-16 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-md px-2 pb-8">
        <div className="flex justify-center mb-2">
          {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
            <button
              key={key}
              className="w-8 h-10 md:w-10 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex justify-center mb-2">
          {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
            <button
              key={key}
              className="w-8 h-10 md:w-10 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="w-14 h-10 md:w-16 md:h-14 bg-gray-500 text-white text-xs font-bold rounded m-0.5 flex items-center justify-center">
            ENTER
          </button>
          {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
            <button
              key={key}
              className="w-8 h-10 md:w-10 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center"
            >
              {key}
            </button>
          ))}
          <button className="w-14 h-10 md:w-16 md:h-14 bg-gray-500 text-white font-bold rounded m-0.5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
              <line x1="18" y1="9" x2="12" y2="15"></line>
              <line x1="12" y1="9" x2="18" y2="15"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-xs text-gray-500 py-2 text-center border-t border-gray-700">
        © 2025 Joseph Louie
      </footer>
    </div>
  );
}

export default WordleGameBoard;
