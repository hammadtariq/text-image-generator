import { Button } from "antd";
import { useState } from "react";

function ProductDesigning({ productDetails, onTemplateChange }) {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleSizeSelection = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleColorSelection = (v) => {
    onTemplateChange(v);
    setSelectedColor(v.color);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">{productDetails.product.title}</h2>

      <div className="flex items-center">
        <span className="text-sm text-gray-600"> 📌 </span>
        <button className="text-blue-500 underline text-sm ms-1 cursor-pointer">
          Pricing & file guidelines
        </button>
      </div>

      <hr />

      {/* Technique Selection */}
      <div>
        <h3 className="font-semibold mb-2">Technique</h3>
        <div className="flex gap-2 flex-wrap">
          {productDetails.product.techniques.map(
            ({ key, display_name }, index) => (
              <Button
                key={key}
                type={
                  index === 0 && !selectedTechnique
                    ? "primary"
                    : key === selectedTechnique
                    ? "primary"
                    : "default"
                }
                shape="round"
                onClick={() => setSelectedTechnique(key)}
              >
                {display_name}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="font-semibold mb-2">Color</h3>
        <div className="flex gap-2 flex-wrap">
          {[
            ...new Map(
              productDetails.variants.map((v) => [v.color, v])
            ).values(),
          ].map((variant) => (
            <div
              key={variant.color}
              className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                selectedColor === variant.color
                  ? "border-blue-600 ring-2 ring-blue-300"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: variant.color_code }}
              onClick={() => handleColorSelection(variant)}
              title={variant.color}
            />
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="font-semibold mb-2">Size</h3>
        <div className="flex gap-2 flex-wrap">
          {[...new Set(productDetails.variants.map((v) => v.size))].map(
            (size) => (
              <label
                key={size}
                className="flex items-center gap-1 text-sm px-2 py-1 border rounded-lg cursor-pointer transition hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeSelection(size)}
                />
                {size}
              </label>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDesigning;
