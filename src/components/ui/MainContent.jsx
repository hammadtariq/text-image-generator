import ProductDesigning from "./ProductDesigning";
import TextDesigning from "./TextDesigning";
import QuickDesigns from "./QuickDesigns";
import AiGeneratorBlock from "./AiGeneratorBlock";

function MainContent({ canvas, productDetail, setTemplate, activeSection }) {
  return (
    <div className="border p-4 h-full w-96">
      {activeSection === "Product" && (
        <ProductDesigning productDetails={productDetail} canvas={canvas} onTemplateChange={setTemplate} />
      )}
      {activeSection === "Text" && <TextDesigning canvas={canvas} />}
      {activeSection === "Saved designs" && <></>}
      {activeSection === "Clipart" && <></>}
      {activeSection === "Quick Designs" && <QuickDesigns canvas={canvas} />}
      {activeSection === "AI Generator" && <AiGeneratorBlock canvas={canvas} />}
      {activeSection === "Fill" && <></>}
      {activeSection === "Layers" && <></>}
    </div>
  );
}

export default MainContent;
