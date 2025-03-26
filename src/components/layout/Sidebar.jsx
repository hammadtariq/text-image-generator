import { Drawer } from "antd";
import { useState } from "react";
import GeneratorForm from "../GeneratorForm";
import ImageDisplay from "../ImageDisplay";
import ProductPreview from "../ProductPreview";

function Sidebar({ activeSection, setActiveSection, openUploadModal, canvas }) {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { name: "Product", icon: "👕" },
    { name: "Uploads", icon: "⬆️" },
    { name: "Text", icon: "🔤" },
    { name: "Saved designs", icon: "🖼️" },
    { name: "Clipart", icon: "😀" },
    { name: "Quick Designs", icon: "✨" },
    { name: "AI Generator", icon: "🤖" },
    { name: "Fill", icon: "🪣" },
    { name: "Layers", icon: "📚" },
  ];

  return (
    <div className="w-20 bg-white border-r p-3 flex flex-col gap-4 items-center overflow-y-auto">
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => {
            if (item.name === "Uploads") {
              openUploadModal();
              return; // Don't change active section for "Uploads"
            } else if (item.name === "AI Generator") {
              showDrawer();
            }
            setActiveSection(item.name);
          }}
          className={`flex flex-col items-center gap-1 w-full p-2 rounded-md transition cursor-pointer ${
            activeSection === item.name
              ? "bg-gray-100 font-semibold"
              : "text-gray-600"
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs">{item.name}</span>
        </button>
      ))}
      <Drawer
        title="Basic Drawer"
        onClose={onClose}
        open={open}
        placement="left"
      >
        <>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Text to Image Generator
          </h1>
          <GeneratorForm
            setGeneratedImage={setGeneratedImage}
            setGeneratedImageUrl={setGeneratedImageUrl}
            setLoading={setLoading}
            loading={loading}
          />
          <ImageDisplay image={generatedImage} loading={loading} canvas={canvas} />
        </>
      </Drawer>
    </div>
  );
}

export default Sidebar;
