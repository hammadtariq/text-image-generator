import { useEffect, forwardRef, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import { Button } from "antd";
import { useProductMockup } from "../../hooks/useMockup";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DesignEditor = forwardRef(({ setCanvas, productId, template }, ref) => {
  const {
    product: productMockup,
    isLoading: isMockupLoading,
    isError: isMockupError,
  } = useProductMockup(productId);

  const fabricCanvasRef = useRef(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantImages, setVariantImages] = useState([]);
  const [boundingArea, setBoundingArea] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Load image and set background
  const loadImage = useCallback(
    (fabricCanvas, imageUrl, backgroundColor = "#ffffff") => {
      if (!imageUrl) return;

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.crossOrigin = "anonymous";

      imgElement.onload = () => {
        const img = new fabric.Image(imgElement, {
          scaleX: fabricCanvas.width / imgElement.width,
          scaleY: fabricCanvas.height / imgElement.height,
          selectable: false,
        });

        fabricCanvas.set("backgroundColor", backgroundColor);
        fabricCanvas.set("backgroundImage", img);
        fabricCanvas.requestRenderAll();
      };
    },
    []
  );

  // Load the mockup variant and templates, then update the canvas
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
    setSelectedVariant(selectedVariantData.variant_id);
  }, [productMockup, template]);

  // Utility function to update the bounding area based on template dimensions
  const updateBoundingArea = useCallback((template) => {
    const { printAreaWidth, printAreaHeight, printAreaTop, printAreaLeft } =
      template;

    const newBoundingArea = {
      left: printAreaLeft,
      top: printAreaTop,
      right: printAreaLeft + printAreaWidth,
      bottom: printAreaTop + printAreaHeight,
    };

    // Update boundingArea only if it has changed to avoid unnecessary re-renders
    setBoundingArea((prevArea) =>
      prevArea &&
      prevArea.left === newBoundingArea.left &&
      prevArea.top === newBoundingArea.top &&
      prevArea.right === newBoundingArea.right &&
      prevArea.bottom === newBoundingArea.bottom
        ? prevArea
        : newBoundingArea
    );
  }, []);

  // Initialize canvas, load image, and draw bounding area
  useEffect(() => {
    if (!ref?.current) return;

    const fabricCanvas = new fabric.Canvas(ref.current, {
      width: 500,
      height: 500,
      backgroundColor: "white",
    });

    fabricCanvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    const selectedImage = variantImages.find(
      (v) => v.variantId === selectedVariant || v.id === selectedVariant
    );

    if (selectedImage) {
      loadImage(
        fabricCanvas,
        selectedImage.imageUrl,
        selectedImage.backgroundColor
      );
      updateBoundingArea(selectedImage); // Update bounding area based on selected template
    }

    // Draw the bounding box on the canvas if boundingArea is available
    if (boundingArea) {
      const { left, top, right, bottom } = boundingArea;
      const rect = new fabric.Rect({
        left,
        top,
        width: right - left,
        height: bottom - top,
        stroke: "red",
        strokeWidth: 2,
        fill: "transparent",
      });
      fabricCanvas.add(rect);
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, [
    ref,
    setCanvas,
    selectedVariant,
    variantImages,
    loadImage,
    updateBoundingArea,
    boundingArea,
  ]);

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
            {variantImages.map((variant) => (
              <Button
                key={variant.id}
                type={variant.id === selectedVariant ? "primary" : "default"}
                shape="round"
                onClick={() => setSelectedVariant(variant.id)}
                style={{
                  backgroundColor:
                    variant.id === selectedVariant ? "#1890ff" : "",
                  color: variant.id === selectedVariant ? "white" : "",
                }}
              >
                {variant.label}
              </Button>
            ))}
          </div>

          {errorMessage && (
            <div className="error-message text-red-500">{errorMessage}</div>
          )}

          <canvas ref={ref} className="border" />
        </>
      )}
    </div>
  );
});

export default DesignEditor;
