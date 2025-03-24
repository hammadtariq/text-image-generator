import { useEffect, forwardRef } from "react";
import * as fabric from "fabric";

const DesignEditor = forwardRef(({ setCanvas }, ref) => {
  useEffect(() => {
    if (!ref.current) return;

    const fabricCanvas = new fabric.Canvas(ref.current, {
      width: 500,
      height: 500,
      backgroundColor: "white",
    });

    setCanvas(fabricCanvas); // Store Fabric.js instance in state

    return () => fabricCanvas.dispose(); // Cleanup on unmount
  }, [ref, setCanvas]);

  return <canvas ref={ref} className="border" />;
});

export default DesignEditor;
