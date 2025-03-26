import { useEffect, forwardRef, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
const productSides = {
  frontImage:
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Blue_Tshirt.jpg", // Existing image for left chest view
  sideImage:
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Blue_Tshirt.jpg", // Right sleeve view
  backImage:
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Blue_Tshirt.jpg", // Left sleeve view
};

const DesignEditor = forwardRef(({ setCanvas,  }, ref) => {
  const [selectedSide, setSelectedSide] = useState("frontImage");
  const errorMessageRef = useRef("");

  const loadImage = useCallback((fabricCanvas, imageUrl) => {
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = () => {
      const img = new fabric.FabricImage(imgElement, {
        scaleX: fabricCanvas.width / imgElement.width,
        scaleY: fabricCanvas.height / imgElement.height,
        selectable: false,
      });

      fabricCanvas.set("backgroundImage", img);
      fabricCanvas.requestRenderAll();
    };
  }, []);

  useEffect(() => {
    if (!ref?.current) return;

    const fabricCanvas = new fabric.Canvas(ref.current, {
      width: 500,
      height: 500,
      backgroundColor: "white",
    });

    setCanvas(fabricCanvas);

    loadImage(fabricCanvas, productSides[selectedSide]);

    // Define bounding area
    const boundingArea = {
      left: 125,
      top: 100,
      right: 370,
      bottom: 250,
    };

    fabricCanvas.on("object:moving", (e) => {
      const obj = e.target;
      if (!obj) return;

      obj.setCoords();
      let outOfBounds = false;

      if (obj.left < boundingArea.left) {
        obj.left = boundingArea.left;
        outOfBounds = true;
      }
      if (obj.top < boundingArea.top) {
        obj.top = boundingArea.top;
        outOfBounds = true;
      }
      if (obj.left + obj.getScaledWidth() > boundingArea.right) {
        obj.left = boundingArea.right - obj.getScaledWidth();
        outOfBounds = true;
      }
      if (obj.top + obj.getScaledHeight() > boundingArea.bottom) {
        obj.top = boundingArea.bottom - obj.getScaledHeight();
        outOfBounds = true;
      }

      errorMessageRef.current = outOfBounds
        ? "Object cannot be moved outside the designated area!"
        : "";
    });

    fabricCanvas.on("selection:created", (e) => {
      const activeObject = e.selected[0];

      if (activeObject) {
        const canvasWidth = fabricCanvas.getWidth();
        const canvasHeight = fabricCanvas.getHeight();
        const objectWidth = activeObject.getScaledWidth();
        const objectHeight = activeObject.getScaledHeight();

        // Ensure the object is within bounds
        const leftPosition = Math.min(
          boundingArea.right - objectWidth,
          Math.max(boundingArea.left, canvasWidth - objectWidth - 120)
        );
        const topPosition = Math.min(
          boundingArea.bottom - objectHeight,
          Math.max(boundingArea.top, canvasHeight - objectHeight - 350)
        );

        activeObject.set({
          left: leftPosition,
          top: topPosition,
        });

        activeObject.setCoords();
        fabricCanvas.renderAll();
      }
    });

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [ref, setCanvas, selectedSide, loadImage]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setSelectedSide("frontImage")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Front Image
        </button>
        <button
          onClick={() => setSelectedSide("sideImage")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Side Image
        </button>
        <button
          onClick={() => setSelectedSide("backImage")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Back Image
        </button>
      </div>
      {errorMessageRef.current && (
        <div className="error-message text-red-500">
          {errorMessageRef.current}
        </div>
      )}
      <canvas ref={ref} className="border" />
    </div>
  );
});

export default DesignEditor;
