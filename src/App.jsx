import { useState } from 'react';
import GeneratorForm from './components/GeneratorForm';
import ImageDisplay from './components/ImageDisplay';

function App() {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Text to Image Generator</h1>
      <GeneratorForm setGeneratedImage={setGeneratedImage} setLoading={setLoading} loading={loading} />
      <ImageDisplay image={generatedImage} loading={loading} />
    </div>
  );
}

export default App;