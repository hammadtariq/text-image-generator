import { useEffect, forwardRef, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import { Button } from "antd";
import { useProductMockup } from "../../hooks/useMockup";

const MAX_DISPLAY_WIDTH = 600; // desired maximum display width (px)

const DesignEditor = forwardRef(({ setCanvas, productId, template }, ref) => {
  const {
    product: productMockup,
    isLoading: isMockupLoading,
    isError: isMockupError,
  } = useProductMockup(productId);

  const fabricCanvasRef = useRef(null);
  const boundingBoxRef = useRef(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantImages, setVariantImages] = useState([]);
  const [boundingArea, setBoundingArea] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayScale, setDisplayScale] = useState(1);

  // Utility function to format placement labels
  const formatPlacementLabel = (placement) => {
    const words = placement.split("_").filter((word) => word !== "embroidery");
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
    const positions = words.filter((word) => positionIndicators.includes(word));
    const remainingWords = words.filter(
      (word) => !positionIndicators.includes(word)
    );

    return [...positions, ...remainingWords]
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const saveDesign = useCallback(() => {
    if (fabricCanvasRef?.current) {
      const selectedImage = variantImages.find((v) => v.id === selectedVariant);
      if (!selectedImage) return;
      debugger;
      const canvas = fabricCanvasRef.current;
      const json = canvas.toJSON();

      // Save the design with a unique key based on the selected image's id
      localStorage.setItem(
        `canvasState-${selectedImage.id}`,
        JSON.stringify(json)
      );
    }
  }, [variantImages, selectedVariant]);

  // Load image and set as background, scaling it by displayScale.
  const loadImage = useCallback(
    (
      fabricCanvas,
      imageUrl,
      templateWidth,
      templateHeight,
      backgroundColor = "#ffffff",
      displayScale
    ) => {
      if (!imageUrl) return;

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.crossOrigin = "anonymous";

      imgElement.onload = () => {
        // Calculate scaled dimensions for the canvas:
        const scaledWidth = templateWidth * displayScale;
        const scaledHeight = templateHeight * displayScale;
        // Set the canvas size to the scaled template size:
        fabricCanvas.setWidth(scaledWidth);
        fabricCanvas.setHeight(scaledHeight);

        // Compute scaling to fit the image into the scaled canvas:
        const imgScaleX = scaledWidth / imgElement.width;
        const imgScaleY = scaledHeight / imgElement.height;

        const img = new fabric.FabricImage(imgElement, {
          selectable: false,
          evented: false,
          left: 0,
          top: 0,
          scaleX: imgScaleX,
          scaleY: imgScaleY,
        });

        fabricCanvas.set("backgroundColor", backgroundColor);
        fabricCanvas.set(
          "backgroundImage",
          img,
          fabricCanvas.renderAll.bind(fabricCanvas)
        );
      };
    },
    []
  );

  // Load the mockup variant and templates, then update state
  useEffect(() => {
    if (
      !productMockup ||
      !productMockup.variant_mapping ||
      !productMockup.templates
    )
      return;

    const selectedVariantData = productMockup.variant_mapping.find((variant) =>
      template
        ? variant.variant_id === template.id
        : variant.variant_id === productMockup.variant_mapping[0].variant_id
    );

    if (!selectedVariantData) {
      setErrorMessage("Selected variant not found.");
      return;
    }

    const filteredTemplates = selectedVariantData?.templates || [];
    const variantTemplateImages = filteredTemplates
      .map((t) => {
        const templateData = productMockup.templates.find(
          (td) => t.template_id === td.template_id
        );
        if (!templateData) return null;

        return {
          id: templateData.template_id,
          variantId: selectedVariantData.variant_id,
          label: formatPlacementLabel(t.placement),
          imageUrl: templateData.image_url,
          backgroundUrl: templateData.background_url,
          backgroundColor: templateData.background_color,
          printfileId: templateData.printfile_id,
          templateWidth: templateData.template_width,
          templateHeight: templateData.template_height,
          printAreaWidth: templateData.print_area_width,
          printAreaHeight: templateData.print_area_height,
          printAreaTop: templateData.print_area_top,
          printAreaLeft: templateData.print_area_left,
          isTemplateOnFront: templateData.is_template_on_front,
          orientation: templateData.orientation,
        };
      })
      .filter(Boolean);

    setVariantImages(variantTemplateImages);
    const variantId = selectedVariantData.templates[0].template_id;
    setSelectedVariant(variantId);
  }, [productMockup, template]);

  // Update the bounding area based on template dimensions (no scaling yet)
  const updateBoundingArea = useCallback((template) => {
    if (!template) return;

    const { printAreaWidth, printAreaHeight, printAreaTop, printAreaLeft } =
      template;

    // Note: These coordinates are in the original template pixel space.
    const newBoundingArea = {
      left: printAreaLeft,
      top: printAreaTop,
      right: printAreaLeft + printAreaWidth,
      bottom: printAreaTop + printAreaHeight,
    };

    setBoundingArea((prevArea) =>
      prevArea &&
      prevArea.left === newBoundingArea.left &&
      prevArea.top === newBoundingArea.top &&
      prevArea.right === newBoundingArea.right &&
      prevArea.bottom === newBoundingArea.bottom
        ? prevArea
        : { ...newBoundingArea }
    );
  }, []);

  const loadData = useCallback((selectedImageId) => {
    // Load the saved design for the selected variant from localStorage or the state
    const savedState = localStorage.getItem(`canvasState-${selectedImageId}`);
    const parsedData = JSON.parse(savedState);

    if (parsedData) {
      const fabricCanvas = fabricCanvasRef.current;

      fabricCanvas.loadFromJSON(parsedData, () => {
        // After everything is loaded, loop through objects and disable controls
        fabricCanvas.getObjects().forEach((obj) => {
          obj.hasControls = false;
        });

        fabricCanvas.renderAll();
      });
    }
  }, []);

  // Initialize canvas, load image, and update bounding area
  useEffect(() => {
    if (!ref?.current) return;
    const selectedImage = variantImages.find((v) => v.id === selectedVariant);
    if (!selectedImage) return;

    // Calculate a display scale to shrink the template if needed.
    // For example, if the template is 3000px wide and MAX_DISPLAY_WIDTH is 600:
    const scale = Math.min(MAX_DISPLAY_WIDTH / selectedImage.templateWidth, 1);
    setDisplayScale(scale);

    const fabricCanvas = new fabric.Canvas(ref.current, {
      // Temporary width/height; loadImage will set the final scaled dimensions.
      width: selectedImage.templateWidth * scale,
      height: selectedImage.templateHeight * scale,
      backgroundColor: "white",
    });

    fabricCanvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    loadData(selectedImage.id);

    setTimeout(() => {
      loadImage(
        fabricCanvas,
        selectedImage.imageUrl,
        selectedImage.templateWidth,
        selectedImage.templateHeight,
        selectedImage.backgroundColor,
        scale
      );
    }, 150);

    updateBoundingArea(selectedImage); // boundingArea remains in original pixel space

    return () => {
      saveDesign();
      fabricCanvas.dispose();
    };
  }, [
    ref,
    setCanvas,
    selectedVariant,
    variantImages,
    loadImage,
    updateBoundingArea,
    loadData,
    saveDesign,
  ]);

  // Draw (or update) the bounding box using the displayScale factor.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !boundingArea) return;

    // Remove existing bounding box if any.
    if (boundingBoxRef.current) {
      canvas.remove(boundingBoxRef.current);
    }

    // Multiply all bounding area coordinates by the displayScale.
    const scaledLeft = boundingArea.left * displayScale;
    const scaledTop = boundingArea.top * displayScale;
    const scaledWidth = (boundingArea.right - boundingArea.left) * displayScale;
    const scaledHeight =
      (boundingArea.bottom - boundingArea.top) * displayScale;

    const boundingBox = new fabric.Rect({
      left: scaledLeft,
      top: scaledTop,
      width: scaledWidth,
      height: scaledHeight,
      stroke: "red",
      strokeWidth: 2,
      fill: "transparent",
      selectable: false,
      evented: false,
    });

    boundingBoxRef.current = boundingBox;
    canvas.add(boundingBox);
    canvas.requestRenderAll();
  }, [boundingArea, displayScale, selectedVariant]);

  // Constrain object movement within the (scaled) bounding area.
  useEffect(() => {
    if (!fabricCanvasRef.current || !boundingArea) return;
    const canvas = fabricCanvasRef.current;
    const scaledLeft = boundingArea.left * displayScale;
    const scaledTop = boundingArea.top * displayScale;
    const scaledRight = boundingArea.right * displayScale;
    const scaledBottom = boundingArea.bottom * displayScale;

    canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (obj.left < scaledLeft) obj.left = scaledLeft;
      if (obj.top < scaledTop) obj.top = scaledTop;
      if (obj.left + obj.width * obj.scaleX > scaledRight)
        obj.left = scaledRight - obj.width * obj.scaleX;
      if (obj.top + obj.height * obj.scaleY > scaledBottom)
        obj.top = scaledBottom - obj.height * obj.scaleY;
    });
  }, [boundingArea, displayScale, selectedVariant]);

  // Constrain object scaling within the (scaled) bounding area.
  useEffect(() => {
    if (!fabricCanvasRef.current || !boundingArea) return;
    const canvas = fabricCanvasRef.current;
    const scaledLeft = boundingArea.left * displayScale;
    const scaledTop = boundingArea.top * displayScale;
    const scaledRight = boundingArea.right * displayScale;
    const scaledBottom = boundingArea.bottom * displayScale;

    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      const scaleX = obj.scaleX;
      const scaleY = obj.scaleY;
      const newWidth = obj.width * scaleX;
      const newHeight = obj.height * scaleY;

      if (obj.left < scaledLeft) obj.left = scaledLeft;
      if (obj.top < scaledTop) obj.top = scaledTop;
      if (obj.left + newWidth > scaledRight)
        obj.scaleX = Math.min(scaleX, (scaledRight - obj.left) / obj.width);
      if (obj.top + newHeight > scaledBottom)
        obj.scaleY = Math.min(scaleY, (scaledBottom - obj.top) / obj.height);
    });
  }, [boundingArea, displayScale, selectedVariant]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !boundingArea) return;

    const scaledLeft = boundingArea.left * displayScale;
    const scaledTop = boundingArea.top * displayScale;
    const scaledRight = boundingArea.right * displayScale;
    const scaledBottom = boundingArea.bottom * displayScale;

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

    const repositionIntoBoundingArea = (obj) => {
      const width = obj.width * obj.scaleX;
      const height = obj.height * obj.scaleY;

      // Center the object inside the bounding area
      const centerX = (scaledLeft + scaledRight) / 2 - width / 2;
      const centerY = (scaledTop + scaledBottom) / 2 - height / 2;

      // Clamp the object position to ensure it stays within the bounds
      obj.left = clamp(centerX, scaledLeft, scaledRight - width);
      obj.top = clamp(centerY, scaledTop, scaledBottom - height);
    };

    const handleObjectAdded = (e) => {
      const obj = e.target;

      // Avoid repositioning background images or unselectable items
      if (!obj.selectable || obj === boundingBoxRef.current) return;

      repositionIntoBoundingArea(obj);
      canvas.requestRenderAll();
    };

    canvas.on("object:added", handleObjectAdded);

    return () => {
      canvas.off("object:added", handleObjectAdded);
    };
  }, [boundingArea, displayScale]);

  return (
    <div>
      {isMockupLoading && (
        <p className="text-gray-500">Loading product mockup...</p>
      )}
      {isMockupError && (
        <p className="text-red-500">Error loading product. Please try again.</p>
      )}
      {!isMockupLoading && !isMockupError && (
        <>
          <div className="mb-4">
            {variantImages.map((variant, index) => (
              <Button
                key={variant.id}
                type={
                  index === 0 && selectedVariant === variant.variantId
                    ? "primary"
                    : variant.id === selectedVariant
                    ? "primary"
                    : "default"
                }
                shape="round"
                onClick={() => setSelectedVariant(variant.id)} // Set selected variant and save the design
              >
                {variant.label}
              </Button>
            ))}
          </div>
          {errorMessage && (
            <div className="error-message text-red-500">{errorMessage}</div>
          )}
          <canvas ref={ref} className="border w-100 h-auto" />
        </>
      )}
    </div>
  );
});

export default DesignEditor;
