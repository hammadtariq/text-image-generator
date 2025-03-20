import React, { useState } from "react";
import { useDrop } from "react-dnd";
import DraggableImage from "../components/DraggableImage";

const sampleImages = [
  "https://picsum.photos/100/100?random=1",
  "https://picsum.photos/100/100?random=2",
  "https://picsum.photos/100/100?random=3",
];

const TShirtCustomizer = () => {
  const [droppedImages, setDroppedImages] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      setDroppedImages((prevImages) => [
        ...prevImages,
        { id: Date.now(), src: item.src, x: offset.x - 450, y: offset.y - 150 },
      ]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex h-screen p-4 bg-gray-100">
      {/* Left Panel: Drag Image Selection */}
      <div className="w-1/3 p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4 text-center">Drag an Image</h2>
        <div className="flex flex-col gap-4 items-center">
          {sampleImages.map((img, index) => (
            <DraggableImage key={index} src={img} />
          ))}
        </div>
      </div>

      {/* Right Panel: T-Shirt Design Area */}
      <div className="w-2/3 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">T-Shirt Customizer</h1>
        <p className="text-gray-600 mb-4">Drag and drop your image onto the T-shirt.</p>

        <div
          ref={drop}
          className={`relative w-80 h-96 flex items-center justify-center border-2 border-dashed ${
            isOver ? "border-blue-500" : "border-gray-400"
          }`}
          style={{
            backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Blue_Tshirt.jpg/300px-Blue_Tshirt.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Render Dropped Images */}
          {droppedImages.map((image) => (
            <DraggableImage key={image.id} src={image.src} initialX={image.x} initialY={image.y} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TShirtCustomizer;
