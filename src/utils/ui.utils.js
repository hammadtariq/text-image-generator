import { Canvas } from "fabric";

// Utility function to format placement labels
export const formatPlacementLabel = (placement) => {
  const positionIndicators = [
    "left",
    "right",
    "top",
    "bottom",
    "front",
    "back",
    "side",
    "inside",
    "outside",
  ];
  const words = placement.split("_").filter((word) => word !== "embroidery");
  const positions = words.filter((word) => positionIndicators.includes(word));
  const remainingWords = words.filter(
    (word) => !positionIndicators.includes(word)
  );

  return [...positions, ...remainingWords]
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Utility function to initialize fabric canvas
export const initializeFabricCanvas = (canvasEl, selectedImage, scale) => {
  const fabricCanvas = new Canvas(canvasEl, {
    width: selectedImage.printAreaWidth * scale,
    height: selectedImage.printAreaHeight * scale,
    backgroundColor: "transparent",
  });

  return fabricCanvas;
};

// Utility function to center objects on canvas
export const centerObject = (fabricCanvas, obj) => {
  const canvasWidth = fabricCanvas.getWidth();
  const canvasHeight = fabricCanvas.getHeight();
  obj.set({
    left: canvasWidth / 2 - obj.getScaledWidth() / 2,
    top: canvasHeight / 2 - obj.getScaledHeight() / 2,
  });
  obj._hasBeenCentered = true;
  obj.setCoords();
  fabricCanvas.requestRenderAll();
};

// Utility function to restrict object movement within canvas bounds
export const clampObjectWithinBounds = (canvas, obj) => {
  const bounds = obj.getBoundingRect(false);
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Clamp position to canvas
  if (bounds.left < 0) obj.left -= bounds.left;
  if (bounds.top < 0) obj.top -= bounds.top;
  if (bounds.left + bounds.width > canvasWidth)
    obj.left -= bounds.left + bounds.width - canvasWidth;
  if (bounds.top + bounds.height > canvasHeight)
    obj.top -= bounds.top + bounds.height - canvasHeight;

  obj.setCoords(); // update coordinates
};

// Utility function to restrict scaling within canvas bounds
export const restrictScaling = (canvas, obj) => {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const maxScaleX = canvasWidth / obj.width;
  const maxScaleY = canvasHeight / obj.height;

  obj.scaleX = Math.min(obj.scaleX, maxScaleX);
  obj.scaleY = Math.min(obj.scaleY, maxScaleY);

  obj.setCoords();
};


// Helper to transform template data
export const mapTemplateData = (placement, template, variantId) => ({
  id: template.template_id,
  variantId,
  label: formatPlacementLabel(placement),
  imageUrl: template.image_url,
  backgroundUrl: template.background_url,
  backgroundColor: template.background_color,
  printfileId: template.printfile_id,
  templateWidth: template.template_width,
  templateHeight: template.template_height,
  printAreaWidth: template.print_area_width,
  printAreaHeight: template.print_area_height,
  printAreaTop: template.print_area_top,
  printAreaLeft: template.print_area_left,
  isTemplateOnFront: template.is_template_on_front,
  orientation: template.orientation,
});