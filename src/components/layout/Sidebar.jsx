function Sidebar({ activeSection, setActiveSection, openUploadModal }) {
  const menuItems = [
    { name: "Product", icon: "👕" },
    { name: "Uploads", icon: "⬆️" },
    { name: "Text", icon: "🔤" },
    // { name: "Saved designs", icon: "🖼️" },
    // { name: "Clipart", icon: "😀" },
    { name: "Quick Designs", icon: "✨" },
    { name: "AI Generator", icon: "🤖" },
    // { name: "Fill", icon: "🪣" },
    // { name: "Layers", icon: "📚" },
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
    </div>
  );
}

export default Sidebar;
