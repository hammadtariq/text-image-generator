import { useState } from "react";

function Header() {
  const [history, setHistory] = useState(["Unisex Hoodie"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentValue = history[currentIndex];

  // Handle input change and update history
  const handleChange = (e) => {
    const newText = e.target.value;
    const newHistory = [...history.slice(0, currentIndex + 1), newText];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  // Undo function
  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Redo function
  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="flex items-center justify-between border rounded-md p-4 py-5">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="border rounded-md px-3 py-1 font-semibold focus:outline-none"
          value={currentValue}
          onChange={handleChange}
        />{" "}
        |
        <a href="#" className="text-blue-600 text-sm">
          Change product
        </a>
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <div className="mr-20">
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className={`hover:text-gray-600 mr-3 text-3xl ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed text-3xl" : ""
            }`}
          >
            ↩
          </button>
          <button
            onClick={handleRedo}
            disabled={currentIndex === history.length - 1}
            className={`hover:text-gray-600 text-3xl${
              currentIndex === history.length - 1
                ? "opacity-50 cursor-not-allowed text-3xl"
                : ""
            }`}
          >
            ↪
          </button>
        </div>
        <button className="hover:text-gray-600 text-3xl">✕</button>
      </div>
    </div>
  );
}

export default Header;
