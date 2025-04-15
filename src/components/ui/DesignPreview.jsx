import { useEffect, forwardRef, useState, useRef, useCallback } from "react";
import { useProductMockup } from "../../hooks/useMockup";
import {
  addDeleteControl,
  addStyleToObject,
  clampObjectWithinBounds,
  formatPlacementLabel,
  initializeFabricCanvas,
  restrictScaling,
} from "../../utils/ui.utils";
import MockupCanvas from "./MockupCanvas";
import VariantSelector from "./VariantSelector";
import SaveHandler from "./SaveHandler";

const MAX_DISPLAY_WIDTH = 600;

const DesignPreview = forwardRef(
  ({ setCanvas, productId, template }, fabricCanvasRef) => {
    const {
      product: productMockup,
      isLoading,
      isError,
    } = useProductMockup(productId);

    const [displayScale, setDisplayScale] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [variantImages, setVariantImages] = useState([]);
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [fabricInstance, setFabricInstance] = useState(null);

    const boundingBoxRef = useRef(null);

    // Prevent iOS gesture zoom
    useEffect(() => {
      const canvasEl = fabricCanvasRef?.current;
      if (!canvasEl) return;

      const handleTouchStart = (e) => e.preventDefault();
      canvasEl.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });

      return () => canvasEl.removeEventListener("touchstart", handleTouchStart);
    }, [fabricCanvasRef]);

    // Extract variant templates
    useEffect(() => {
      if (!productMockup?.variant_mapping || !productMockup?.templates) return;

      const variantData = productMockup.variant_mapping.find((variant) =>
        template ? variant.variant_id === template.id : true
      );

      if (!variantData) {
        setErrorMessage("Selected variant not found.");
        return;
      }

      const templates = variantData.templates
        .map(({ template_id, placement }) => {
          const templateDetails = productMockup.templates.find(
            (t) => t.template_id === template_id
          );
          if (!templateDetails) return null;

          return {
            id: template_id,
            variantId: variantData.variant_id,
            label: formatPlacementLabel(placement),
            imageUrl: templateDetails.image_url,
            backgroundUrl: templateDetails.background_url,
            backgroundColor: templateDetails.background_color,
            printfileId: templateDetails.printfile_id,
            templateWidth: templateDetails.template_width,
            templateHeight: templateDetails.template_height,
            printAreaWidth: templateDetails.print_area_width,
            printAreaHeight: templateDetails.print_area_height,
            printAreaTop: templateDetails.print_area_top,
            printAreaLeft: templateDetails.print_area_left,
            isTemplateOnFront: templateDetails.is_template_on_front,
            orientation: templateDetails.orientation,
          };
        })
        .filter(Boolean);

      setVariantImages(templates);
      setSelectedVariantId(templates[0]?.id);
    }, [productMockup, template]);

    const saveDesign = () => {
      if (!fabricInstance && !currentImage) return;

      localStorage.setItem(
        `canvasState-${currentImage.id}`,
        JSON.stringify(fabricInstance)
      );
    };

    const loadData = useCallback(async (fabricCanvas, selectedImageId) => {
      const savedState = localStorage.getItem(`canvasState-${selectedImageId}`);
      if (!savedState || !fabricCanvas) return;

      const parsedCanvas = JSON.parse(savedState);
      const canvas = await fabricCanvas.loadFromJSON(parsedCanvas);
      console.log("canvas is loaded ........", JSON.stringify(canvas));
      addStyleToObject(canvas)
      addDeleteControl(canvas);
    }, []);

    // Initialize Fabric canvas
    useEffect(() => {
      if (
        !fabricCanvasRef?.current ||
        !selectedVariantId ||
        variantImages.length === 0
      )
        return;

      const selectedImage = variantImages.find(
        (v) => v.id === selectedVariantId
      );
      if (!selectedImage) return;

      setCurrentImage(selectedImage);

      const scale = Math.min(
        MAX_DISPLAY_WIDTH / selectedImage.templateWidth,
        1
      );
      setDisplayScale(scale);

      const canvas = initializeFabricCanvas(
        fabricCanvasRef.current,
        selectedImage,
        scale
      );
      setFabricInstance(canvas);
      setCanvas(canvas);

      // Call loadData with newly created canvas
      loadData(canvas, selectedImage.id);

      return () => canvas.dispose();
    }, [
      fabricCanvasRef,
      selectedVariantId,
      variantImages,
      setCanvas,
      loadData,
    ]);

    // Handle fabric object movement/scaling
    useEffect(() => {
      if (!fabricInstance) return;

      const handleModify = (e) => {
        const obj = e.target;
        restrictScaling(fabricInstance, obj, boundingBoxRef);
        clampObjectWithinBounds(fabricInstance, obj);
        fabricInstance.requestRenderAll();
      };

      fabricInstance.on("object:moving", handleModify);
      fabricInstance.on("object:scaling", handleModify);
      fabricInstance.on("object:rotating", handleModify);

      return () => {
        fabricInstance.off("object:moving", handleModify);
        fabricInstance.off("object:scaling", handleModify);
        fabricInstance.off("object:rotating", handleModify);
      };
    }, [fabricInstance]);

    // UI Render
    return (
      <div>
        {isLoading && (
          <p className="text-gray-500">Loading product mockup...</p>
        )}
        {isError && (
          <p className="text-red-500">
            Error loading product. Please try again.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <SaveHandler onSave={saveDesign} />
            <VariantSelector
              variantImages={variantImages}
              selectedVariantId={selectedVariantId}
              setSelectedVariantId={setSelectedVariantId}
            />

            {errorMessage && (
              <div className="error-message text-red-500">{errorMessage}</div>
            )}

            <MockupCanvas
              currentImage={currentImage}
              displayScale={displayScale}
              boundingBoxRef={boundingBoxRef}
              fabricCanvasRef={fabricCanvasRef}
            />
          </>
        )}
      </div>
    );
  }
);

export default DesignPreview;
