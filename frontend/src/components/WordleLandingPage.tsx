import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

function WordleLandingPage() {
  const navigate = useNavigate();

  const today = new Date();
  const formattedDate = format(today, "MMMM d, yyyy");

  const handlePlayClick = () => {
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto">
      {/* Wordle Logo - Grid */}
      <div className="mb-2">
        <div className="grid grid-cols-3 grid-rows-3 w-20 h-20 border-[2px] border-black rounded-md overflow-hidden">
          <div className="border-[2px] border-black bg-white"></div>
          <div className="border-[2px] border-black bg-white"></div>
          <div className="border-[2px] border-black bg-white"></div>
          <div className="border-[2px] border-black bg-white"></div>
          <div className="border-[2px] border-black bg-[#c9b458]"></div>{" "}
          {/* Yellow square */}
          <div className="border-[2px] border-black bg-white"></div>
          <div className="border-[2px] border-black bg-white"></div>
          <div className="border-[2px] border-black bg-[#6aaa64]"></div>{" "}
          {/* Green square */}
          <div className="border-[2px] border-black bg-[#6aaa64]"></div>{" "}
          {/* Green square */}
        </div>
      </div>

      {/* Wordle Title */}
      <h1 className="text-5xl font-extrabold tracking-tight mt-2 mb-8">
        Wordle
      </h1>

      {/* Description */}
      <p className="text-2xl font-normal mb-10">
        Get 6 chances to guess
        <br />a 5-letter word.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mb-10">
        <button className="border-2 border-gray-300 rounded-full py-3 px-12 text-base font-medium hover:bg-gray-100 transition">
          Log in
        </button>
        <Link to="/game">
          <button
            onClick={handlePlayClick}
            className="bg-black text-white rounded-full py-3 px-12 text-base font-medium hover:bg-gray-800 transition"
          >
            Play
          </button>
        </Link>
      </div>

      {/* Date */}
      <div className="text-lg text-gray-800">{formattedDate}</div>
    </div>
  );
}

export default WordleLandingPage;
