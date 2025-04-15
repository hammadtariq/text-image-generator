export default function MockupCanvas({
  currentImage,
  displayScale,
  boundingBoxRef,
  fabricCanvasRef,
}) {
  return (
    <div
      className="mockup-container border"
      style={{
        position: "relative",
        width: `${currentImage?.templateWidth * displayScale}px`,
        height: `${currentImage?.templateHeight * displayScale}px`,
      }}
    >
      <img
        src={currentImage?.imageUrl}
        alt="Mockup"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: currentImage?.backgroundColor || "transparent",
          display: "block",
          pointerEvents: "none",
        }}
      />
      <div
        ref={boundingBoxRef}
        className="bounding-area"
        style={{
          position: "absolute",
          left: `${currentImage?.printAreaLeft * displayScale}px`,
          top: `${currentImage?.printAreaTop * displayScale}px`,
          width: `${currentImage?.printAreaWidth * displayScale + 5}px`,
          height: `${currentImage?.printAreaHeight * displayScale + 5}px`,

          border: "2px solid red",
        }}
      >
        <canvas ref={fabricCanvasRef} />
      </div>
    </div>
  );
}
