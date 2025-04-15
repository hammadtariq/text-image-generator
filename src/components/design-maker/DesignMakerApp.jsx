import { useState, useRef } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import MainContent from "../ui/MainContent";
import Footer from "../layout/Footer";
import DesignEditor from "../ui/DesignEditor";
import UploadInstructionsModal from "../ui/UploadInstructionsModal";
import FileLibraryModal from "../ui/FileLibraryModal";
import { Layout } from "antd";
import { useParams } from "react-router-dom";
import { useProductById } from "../../hooks/useProducts";
import DesignPreview from "../ui/DesignPreview";

function DesignMakerApp() {
  const { productId } = useParams();
  const [activeSection, setActiveSection] = useState("Product");
  const { product, isLoading, isError } = useProductById(productId);
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFileLibraryVisible, setIsFileLibraryVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [template, setTemplate] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const handleOpenFileLibrary = () => setIsFileLibraryVisible(true);
  const handleCloseFileLibrary = () => setIsFileLibraryVisible(false);

  const undo = () => {
    if (historyPointer > 0) {
      const prevState = history[historyPointer - 1];
      fabricCanvas?.loadFromJSON(prevState, () => {
        fabricCanvas.renderAll();
        setHistoryPointer((prev) => prev - 1);
      });
    }
  };

  const redo = () => {
    if (historyPointer < history.length - 1) {
      const nextState = history[historyPointer + 1];
      fabricCanvas?.loadFromJSON(nextState, () => {
        fabricCanvas.renderAll();
        setHistoryPointer((prev) => prev + 1);
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading product.</div>;
  }

  return (
    <Layout className="w-full h-screen flex flex-col">
      <Header initialValue={product} undo={undo} redo={redo} />

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
            canvas={fabricCanvas}
            productDetail={product}
            setTemplate={setTemplate}
            selectedColor={selectedColor}
            activeSection={activeSection}
            isModalVisible={isModalVisible}
            setSelectedColor={setSelectedColor}
            handleCloseModal={handleCloseModal}
          />
        </div>

        {/* Design Canvas Area */}
        <div className="flex-1 flex justify-center items-center bg-gray-200">
          <div className="border bg-white p-4 w-[90%] flex items-center justify-center shadow-md">
            {
              // <DesignEditor
              //   ref={canvasRef}
              //   template={template}
              //   productId={productId}
              //   setCanvas={setFabricCanvas}
              //   setHistory={setHistory}
              //   setHistoryPointer={setHistoryPointer}
              // />
              <DesignPreview
                ref={canvasRef}
                template={template}
                productId={productId}
                setCanvas={setFabricCanvas}
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
          canvas={fabricCanvas}
          isVisible={isFileLibraryVisible} // Controlled by state
          onClose={handleCloseFileLibrary}
        />
      )}
    </Layout>
  );
}

export default DesignMakerApp;
