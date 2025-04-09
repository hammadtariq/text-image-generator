import { useState } from "react";
import { Modal, Upload, Button, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileLibraryModal = ({ isVisible, onClose }) => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = ({ file, onSuccess }) => {
    setTimeout(() => {
      setFileList((prevList) => [...prevList, file]);
      onSuccess("ok");
    }, 1000);
  };

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
      <Upload customRequest={handleUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload File</Button>
      </Upload>

      <List
        bordered
        dataSource={fileList}
        renderItem={(item) => <List.Item>{item.name}</List.Item>}
      />
    </Modal>
  );
};

export default FileLibraryModal;
