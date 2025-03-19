// components/ProductPreview.jsx
import { useEffect, useRef } from 'react';
import * as fabric from 'fabric'; // Import from fabric.mjs

const ProductPreview = ({ imageUrl }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  // Initialize fabric.js canvas and load the t-shirt preview
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 400,
      });
    }

    const canvas = fabricCanvasRef.current;
    if (!canvas || !imageUrl) return;

    // Clear the canvas
    canvas.clear();

    // T-shirt template (replace with an actual t-shirt mockup URL or local asset)
    const tshirtTemplate = 'https://via.placeholder.com/400x400.png?text=T-Shirt+Template';

    // Load t-shirt template
    fabric.Image.fromURL(tshirtTemplate, (tshirtImg) => {
      tshirtImg.set({
        left: 0,
        top: 0,
        selectable: false,
      });
      canvas.add(tshirtImg);

      // Load generated image
      fabric.Image.fromURL(imageUrl, (img) => {
        img.scaleToWidth(200); // Scale to fit on the t-shirt
        img.set({
          left: 100,
          top: 100,
          selectable: true, // Allow dragging and resizing
        });
        canvas.add(img);
        canvas.renderAll();
      });
    });

    // Cleanup on unmount
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [imageUrl]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Preview on T-Shirt</h2>
      <canvas ref={canvasRef} className="border border-gray-300" />
      <p className="text-sm text-gray-600 mt-2">
        Drag and resize the image to position it on the t-shirt.
      </p>
    </div>
  );
};

export default ProductPreview;