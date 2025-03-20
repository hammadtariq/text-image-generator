import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "react-resizable";

const DraggableImage = ({ src, initialX = 50, initialY = 50 }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [size, setSize] = useState({ width: 80, height: 80 });

  const onResize = (event, { size }) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <Resizable width={size.width} height={size.height} onResize={onResize}>
      <div
        ref={drag}
        className="absolute cursor-move border border-gray-500 bg-white shadow-lg"
        style={{
          left: initialX,
          top: initialY,
          width: size.width,
          height: size.height,
          opacity: isDragging ? 0.5 : 1,
          zIndex: 10, // Ensure it's above the T-shirt
        }}
      >
        <img src={src} alt="Draggable" className="w-full h-full object-cover" />
      </div>
    </Resizable>
  );
};

export default DraggableImage;
