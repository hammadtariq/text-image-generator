import { useEffect } from "react";
import { RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

function UndoRedoHandler({ onUndo, onRedo }) {
  // Listen for Cmd/Ctrl + Z and Cmd/Ctrl + Shift + Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onUndo, onRedo]);

  return (
    <div>
      {/* Undo / Redo Controls */}
      <div className="flex gap-4 my-4">
        <Tooltip title="Undo">
          <Button
            type="primary"
            onClick={onUndo}
            icon={<UndoOutlined />}
            aria-label="Undo"
          />
        </Tooltip>
        <Tooltip title="Redo">
          <Button
            type="primary"
            onClick={onRedo}
            icon={<RedoOutlined />}
            aria-label="Redo"
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default UndoRedoHandler;
