import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GeneratorForm from "./components/GeneratorForm";
import ImageDisplay from "./components/ImageDisplay";
import ProductPreview from "./components/ProductPreview";
import TShirtCustomizer from "./pages/TShirtCustomizer";
import DesignMakerApp from "./components/design-maker/DesignMakerApp";

function App() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <nav className="mb-4">
          <Link to="/" className="text-blue-500 mx-2">
            Home
          </Link>
          <Link to="/customizer" className="text-blue-500 mx-2">
            T-Shirt Customizer
          </Link>
          <Link to="/design-maker" className="text-blue-500 mx-2">
            Design Maker
          </Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
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
                <ImageDisplay image={generatedImage} loading={loading} />
                {generatedImageUrl && (
                  <ProductPreview imageUrl={generatedImageUrl} />
                )}
              </>
            }
          />
          <Route
            path="/customizer"
            element={<TShirtCustomizer imageUrl={generatedImageUrl} />}
          />
          <Route path="/design-maker" element={<DesignMakerApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
