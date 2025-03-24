import { useState } from "react";
import { Modal, Checkbox, Button } from "antd";

const UploadInstructionsModal = ({ isVisible, onClose, onOpenFileLibrary }) => {
  const [_dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    onClose(); // Close instructions modal
    onOpenFileLibrary(); // Open file library modal
  };

  return (
    <Modal
      title="Please Double Check Your Embroidery File"
      open={isVisible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[
        <Checkbox key="checkbox" onChange={(e) => setDontShowAgain(e.target.checked)}>
          I have reviewed the requirements, don’t show this again.
        </Checkbox>,
        <Button key="ok" type="primary" onClick={handleClose}>
          OK
        </Button>,
      ]}
    >
      <p>Please format your files according to the guidelines to ensure high quality.</p>
      <ul>
        <li>1. High profile template</li>
        <li>2. Low profile template</li>
        <li>3. Side logo template</li>
        <li>4. Flat embroidery</li>
        <li>5. 3D Puff embroidery</li>
        <li>6. Partial 3D Puff</li>
        <li>7. Satin stitch outline</li>
        <li>8. Run stitch</li>
        <li>9. Tatami fill</li>
      </ul>
      <p>Don’t skip our video tutorial.</p>
    </Modal>
  );
};

export default UploadInstructionsModal;
