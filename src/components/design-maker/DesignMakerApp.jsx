import { useState, useRef } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import MainContent from "../ui/MainContent";
import Footer from "../layout/Footer";
import DesignEditor from "../ui/DesignEditor";
import UploadInstructionsModal from "../ui/UploadInstructionsModal";
import FileLibraryModal from "../ui/FileLibraryModal";

import { Layout } from "antd";

function DesignMakerApp() {
  const [activeSection, setActiveSection] = useState("Product");
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFileLibraryVisible, setIsFileLibraryVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const handleOpenFileLibrary = () => setIsFileLibraryVisible(true);
  const handleCloseFileLibrary = () => setIsFileLibraryVisible(false);

  return (
    <Layout className="w-full h-screen flex flex-col">
      <Header />

      <div className="flex flex-row flex-1 relative">
        <Sidebar
          activeSection={activeSection}
          canvas={fabricCanvas}
          setActiveSection={setActiveSection}
          openUploadModal={handleOpenModal}
        />

        {/* Tools Panel */}
        <div className="w-1xl bg-gray-100 p-4 border-r overflow-y-auto">
          <MainContent
            activeSection={activeSection}
            canvas={fabricCanvas}
            isModalVisible={isModalVisible}
            handleCloseModal={handleCloseModal}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>

        {/* Design Canvas Area */}
        <div className="flex-1 flex justify-center items-center bg-gray-200">
          <div className="border bg-white p-4 w-[80%] h-[90%] flex items-center justify-center shadow-md">
            {
              <DesignEditor
                ref={canvasRef}
                setCanvas={setFabricCanvas}
                selectedColor={selectedColor}
              />
            }
          </div>
        </div>
      </div>

      <Footer />

      {/* Upload Instructions Modal */}
      <UploadInstructionsModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onOpenFileLibrary={handleOpenFileLibrary} // Open file library after closing
      />

      {/* File Library Modal */}
      {isFileLibraryVisible && (
        <FileLibraryModal
          isVisible={isFileLibraryVisible} // Controlled by state
          onClose={handleCloseFileLibrary}
        />
      )}
    </Layout>
  );
}

export default DesignMakerApp;
