import { useState, useEffect } from "react";

function Header({ initialValue }) {
  const product = initialValue.product;
  const [history, setHistory] = useState([product.title]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset history if the initial value changes
    setHistory([product.title]);
    setCurrentIndex(0);
  }, [product.title]);

  const currentValue = history[currentIndex];

  const handleChange = (e) => {
    const newText = e.target.value;
    const newHistory = [...history.slice(0, currentIndex + 1), newText];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="flex items-center justify-between border rounded-md p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="border rounded-md px-3 py-2 font-semibold focus:outline-none"
          style={{
            width: `${Math.max(currentValue.length, 5)}ch`, // Ensures minimum width of 5 characters
          }}
          value={currentValue}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <div className="mr-20">
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className={`hover:text-gray-600 mr-3 text-3xl ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            ↩
          </button>
          <button
            onClick={handleRedo}
            disabled={currentIndex === history.length - 1}
            className={`hover:text-gray-600 text-3xl ${
              currentIndex === history.length - 1
                ? "opacity-50 cursor-not-allowed"
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
