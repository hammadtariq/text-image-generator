import { useState, useEffect } from "react";
import { Modal, Upload, Button, List, message, Tooltip, Image } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as fabric from "fabric";

const { Dragger } = Upload;
// Delete icon for custom control
const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;

const FileLibraryModal = ({ isVisible, onClose, canvas }) => {
  const [fileList, setFileList] = useState(() => {
    const saved = localStorage.getItem("fileLibrary");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("fileLibrary", JSON.stringify(fileList));
  }, [fileList]);

  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };
  }, [canvas]);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result; // base64 image data
        setFileList((prev) => [
          ...prev,
          { name: file.name, url: base64, type: file.type },
        ]);
        onSuccess("ok");
        message.success(`${file.name} uploaded successfully`);
      };
      reader.readAsDataURL(file); // NOT readAsArrayBuffer
    } catch (error) {
      onError("Upload failed", error);
      message.error(`${file.name} upload failed`);
    }
  };

  const uploadProps = {
    multiple: true,
    accept: ".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps",
    customRequest: handleUpload,
    showUploadList: false,
    beforeUpload: (file) => {
      const isAllowedType = [
        "image/png",
        "image/jpeg",
        "image/svg+xml",
        "application/pdf",
        "application/postscript",
      ].includes(file.type);

      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isAllowedType) {
        message.error("Only PNG, JPG, SVG, PDF, AI, or EPS files are allowed.");
      }

      if (!isLt10M) {
        message.error("File must be smaller than 10MB.");
      }

      return isAllowedType && isLt10M;
    },
  };

  const onApply = (imgUrl) => {
    if (!canvas) return;

    const imgElement = new window.Image();
    imgElement.crossOrigin = "anonymous"; // Avoid CORS issues
    imgElement.src = imgUrl;

    imgElement.onload = () => {
      const maxWidth = 50; // Fixed width
      const maxHeight = 50; // Fixed height

      // Calculate aspect ratio and scale accordingly
      const scaleFactor = Math.min(
        maxWidth / imgElement.width,
        maxHeight / imgElement.height
      );
      const img = new fabric.FabricImage(imgElement, {
        left: 200,
        top: 200,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        hasControls: true,
        hasBorders: true,
        objectCaching: false,
        lockUniScaling: true,
      });

      // ✅ Enable resizing, rotation, and movement
      img.set({
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        lockMovementX: false,
        lockMovementY: false,
      });

      // Ensure consistent positioning for all images
      img.set({
        left: (canvas.width - maxWidth) / 2,
        top: (canvas.height - maxHeight) / 2,
      });

      // ✅ Ensure controls (resizing, rotation, movement) work
      img.setControlsVisibility({
        mt: true, // Middle-top (for scaling)
        mb: true, // Middle-bottom
        ml: true, // Middle-left
        mr: true, // Middle-right
        tl: true, // Top-left (resize + rotate)
        tr: true, // Top-right (resize + rotate)
        bl: true, // Bottom-left (resize + rotate)
        br: true, // Bottom-right (resize + rotate)
        mtr: true, // Rotation control
      });

      // ✅ Add a custom delete control
      img.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -20,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: renderIcon,
        cornerSize: 24,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    };

    imgElement.onerror = () => console.error("Failed to load image:", imgUrl);
  };

  function deleteObject(_eventData, transform) {
    const canvas = transform.target.canvas;
    canvas.remove(transform.target);
    canvas.requestRenderAll();
  }

  function renderIcon(ctx, left, top, _styleOverride, fabricObject) {
    if (!deleteImg.complete || deleteImg.naturalWidth === 0) {
      console.warn("Delete icon is not loaded yet");
      return;
    }

    const size = 24;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  return (
    <Modal
      title="File Library"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Supports multiple file types. Max 10MB per file.
        </p>
      </Dragger>

      <List
        className="mt-4"
        bordered
        dataSource={fileList}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Tooltip title="Apply">
                <Button type="primary" onClick={() => onApply(item.url)}>
                  Apply
                </Button>
              </Tooltip>,
              <Button
                danger
                type="text"
                onClick={() => {
                  const updatedList = fileList.filter((_, i) => i !== index);
                  setFileList(updatedList);
                  message.info(`${item.name} removed`);
                }}
              >
                Remove
              </Button>,
            ]}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {item.type.startsWith("image/") ? (
                <Image src={item.url} alt={item.name} width={60} />
              ) : (
                <span>{item.name}</span>
              )}
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default FileLibraryModal;
