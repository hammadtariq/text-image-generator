import { Canvas, Control, util } from "fabric";

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

export const addDeleteControl = (fabricCanvas) => {
  // Delete icon for custom control
  const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  const deleteImg = document.createElement("img");
  deleteImg.src = deleteIcon;

  function deleteObject(_eventData, transform) {
    const canvas = transform.target.canvas;
    canvas.remove(transform.target);
    canvas.requestRenderAll();
  }

  function renderIcon(ctx, left, top, _styleOverride, fabricObject) {
    if (!deleteImg.complete || deleteImg.naturalWidth === 0) {
      console.warn("Delete icon is not loaded yet");
      return;
    }

    const size = 24;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
  console.log(JSON.stringify(fabricCanvas));

  const objects = fabricCanvas.getObjects();
  // ✅ Add a custom delete control
  objects.forEach((element) => {
    if (element.type.toLowerCase() === "image") {
      element.controls.deleteControl = new Control({
        x: 0.5,
        y: -0.5,
        offsetY: -20,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: renderIcon,
        cornerSize: 24,
      });
    }
  });
  fabricCanvas.renderAll();
};

export const addStyleToObject = (fabricCanvas) => {
  const objs = fabricCanvas.getObjects();
  objs.forEach((obj) => {
    obj.set({
      transparentCorners: false,
      cornerStrokeColor: "red",
      borderColor: "red",
      cornerStyle: "circle",
    });
  });
  fabricCanvas.renderAll();
};
