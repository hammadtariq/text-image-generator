import ProductDesigning from "./ProductDesigning";
import TextDesigning from "./TextDesigning";
import QuickDesigns from "./QuickDesigns";

function MainContent({ activeSection, canvas, selectedColor, setSelectedColor }) {
  return (
    <div className="flex border p-4 h-full">
      {activeSection === "Product" && (
        <ProductDesigning
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          canvas={canvas}
        />
      )}
      {activeSection === "Text" && <TextDesigning canvas={canvas} />}
      {activeSection === "Saved designs" && <></>}
      {activeSection === "Clipart" && <></>}
      {activeSection === "Quick Designs" && <QuickDesigns canvas={canvas} />}
      {activeSection === "Fill" && <></>}
      {activeSection === "Layers" && <></>}
    </div>
  );
}

export default MainContent;
