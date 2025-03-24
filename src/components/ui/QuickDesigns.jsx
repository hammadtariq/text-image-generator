import { useState } from "react";
import { Input } from "antd";
import * as fabric from "fabric";

const images = [
  {
    id: 1,
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    name: "JavaScript",
  },
  {
    id: 2,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg",
    name: "C",
  },
  {
    id: 3,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png",
    name: "C++",
  },
  {
    id: 4,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Python.svg",
    name: "Python",
  },
  {
    id: 5,
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png",
    name: "C#",
  },
  {
    id: 6,
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Rust_programming_language.svg",
    name: "Rust",
  },
  {
    id: 7,
    url: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
    name: "PHP",
  },
  {
    id: 8,
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/JavaScript_badge.svg",
    name: "JavaScript (Alt)",
  },
  {
    id: 9,
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg",
    name: "Bootstrap",
  },
  {
    id: 10,
    url: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    name: "HTML5",
  },
  {
    id: 11,
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    name: "Node.js",
  },
  {
    id: 12,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    name: "React",
  },
];

function QuickDesigns({ canvas }) {
  const [query, setQuery] = useState("");

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(query.toLowerCase())
  );

  const addImageToCanvas = (imgUrl) => {
    if (!canvas) return;

    fabric.Image.fromURL(imgUrl, (img) => {
      img.scaleToWidth(150);
      img.scaleToHeight(150);
      img.set({ left: 50, top: 50, hasControls: true, hasBorders: true });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  return (
    <div className="p-4 w-full">
      <h3 className="font-semibold">Quick Designs</h3>

      {/* Search Bar */}
      <Input
        className="mb-4"
        placeholder="Search programming logos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <div
              key={img.id}
              className="border p-2 cursor-pointer hover:shadow-lg"
              onClick={() => addImageToCanvas(img.url)}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-32 object-contain bg-white p-2"
              />
              <p className="text-center text-sm mt-1">{img.name}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No images found.</p>
        )}
      </div>
    </div>
  );
}

export default QuickDesigns;
