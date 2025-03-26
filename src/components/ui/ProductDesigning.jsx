import { useState } from "react";

function ProductDesigning({ selectedColor, setSelectedColor }) {
  const [selectedTechnique, setSelectedTechnique] = useState("DTG Printing");
  const [selectedSizes, setSelectedSizes] = useState([]);

  const handleSizeSelection = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  return (
    <div>
      <h2 className="text-lg font-bold">
        Unisex Premium Hoodie | Cotton Heritage M2580
      </h2>
      <p className="text-gray-500">📌 Pricing & file guidelines</p>
      {/* Technique Selection */}
      <div className="mt-4 border-t pt-4">
        <h3 className="font-semibold">Technique</h3>
        <div className="flex gap-2">
          {["DTG Printing", "Embroidery"].map((technique) => (
            <button
              key={technique}
              className={`border px-4 py-2 rounded-md ${
                selectedTechnique === technique
                  ? "bg-gray-200 border-gray-500"
                  : "bg-gray-100"
              }`}
              onClick={() => setSelectedTechnique(technique)}
            >
              {technique}
            </button>
          ))}
        </div>
      </div>
      {/* Color Selection */}
      <div className="mt-4">
        <h3 className="font-semibold">Color</h3>
        <div className="flex gap-2">
          {["black", "gray", "blue", "green"].map((color) => (
            <div
              key={color}
              className={`w-8 h-8 border rounded-full bg-${color}-700 cursor-pointer ${
                selectedColor === color ? "border-2 border-black" : ""
              }`}
              onClick={() => setSelectedColor(color)}
            ></div>
          ))}
        </div>
      </div>
      {/* Size Selection */}
      <div className="mt-4">
        <h3 className="font-semibold">Size</h3>
        <div className="flex gap-2">
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeSelection(size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDesigning;
