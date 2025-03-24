import ProductDesigning from "./ProductDesigning";
import TextDesigning from "./TextDesigning";
import QuickDesigns from "./QuickDesigns";

function MainContent({ activeSection, canvas }) {
  return (
    <div className="flex border p-4 h-full">
      {activeSection === "Product" && <ProductDesigning canvas={canvas} />}
      {activeSection === "Text" && <TextDesigning canvas={canvas} />}
      {activeSection === "Saved designs" && <></>}
      {activeSection === "Clipart" && <></>}
      {activeSection === "Quick Designs" && <QuickDesigns />}
      {activeSection === "Premium" && <></>}
      {activeSection === "Fill" && <></>}
      {activeSection === "Layers" && <></>}
    </div>
  );
}

export default MainContent;
