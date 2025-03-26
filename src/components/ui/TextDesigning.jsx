import { useState, useEffect } from "react";
import { Textbox, Control, util } from "fabric";
import { Card } from "antd";
import WebFont from "webfontloader";

function TextDesigning({ canvas }) {
  const [text, setText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [textPresets, setTextPresets] = useState([]);

  useEffect(() => {
    if (!canvas) return;

    const fonts = [
      "Pacifico",
      "Lobster",
      "Playfair Display",
      "Anton",
      "Dancing Script",
      "Roboto Mono",
      "Bangers",
      "Caveat",
      "Press Start 2P",
      "Fjalla One",
      "Permanent Marker",
      "Comic Neue",
    ];

    WebFont.load({
      google: { families: fonts },
      active: () => {
        canvas.renderAll();
        generateTextPreviews(fonts);
      },
    });
    const generateTextPreviews = (fonts) => {
      const presets = fonts.map((font) => ({
        text: font,
        style: { color: "black", fontFamily: font },
        img: generateTextImage(font),
      }));
      setTextPresets(presets);
    };
  }, [canvas]);

  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };
  }, [canvas]);

  const generateTextImage = (font) => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = `30px ${font}, sans-serif`;
    ctx.fillText(font, 10, 50);
    return canvas.toDataURL();
  };

  const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  const deleteImg = document.createElement("img");
  deleteImg.src = deleteIcon;

  const addTextToCanvas = (presetText, style) => {
    const textObj = new Textbox(presetText, {
      // Changed to Textbox for better editing
      left: 50,
      top: 50,
      fontSize: style.fontSize || 30,
      fill: style.color || "black",
      fontStyle: style.fontStyle || "normal",
      fontWeight: style.fontWeight || "normal",
      fontFamily: style.fontFamily || "Arial",
      textDecoration: style.textDecoration || "none",
      shadow: style.shadow || "",
      hasControls: true,
      hasBorders: true,
      editable: true, // Enables text editing
    });

    // Add delete control
    textObj.controls.deleteControl = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24,
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
  };

  // Enable text editing on double click
  canvas.on("mouse:dblclick", (event) => {
    const target = event.target;
    if (target && target.type === "textbox") {
      target.enterEditing();
      target.selectAll();
    }
  });

  function deleteObject(_eventData, transform) {
    const canvas = transform.target.canvas;
    canvas.remove(transform.target);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function renderIcon(ctx, left, top, _styleOverride, fabricObject) {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  return (
    <div className="flex flex-col">
      <h3 className="font-semibold">Add Text</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          if (text.trim()) {
            addTextToCanvas(text, {
              color: "black",
              fontFamily: "Playfair Display",
            });
            setText(""); // Clear text after adding
          }
        }}
      >
        <textarea
          className="border p-2 w-full h-20"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter custom text..."
        />
        <button
          type="submit"
          className={`border p-2 mt-2 w-full ${
            text.trim() ? "bg-gray-200" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!text.trim()}
        >
          Add Custom Text
        </button>
      </form>

      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex justify-between">
          <h4 className="font-bold">Text Presets</h4>
          <h4
            className="text-blue-700 underline cursor-pointer"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "See Less" : "See More"}
          </h4>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {textPresets
            .slice(0, showMore ? textPresets.length : 6)
            .map((preset, index) => (
              <Card
                key={index}
                style={{ background: "none", cursor: "pointer" }}
                className="border p-2 !bg-transparent hover:shadow-lg w-32 h-32 flex items-center justify-center"
                onClick={() => addTextToCanvas(preset.text, preset.style)}
              >
                <p
                  style={{
                    fontWeight: preset.style.fontWeight,
                    color: preset.style.color,
                    fontStyle: preset.style.fontStyle,
                    fontFamily: preset.style.fontFamily || "Arial",
                  }}
                >
                  {preset.text}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TextDesigning;
