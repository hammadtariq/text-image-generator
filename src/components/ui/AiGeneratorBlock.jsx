import { useState } from "react";
import GeneratorForm from "../GeneratorForm";
import ImageDisplay from "../ImageDisplay";

function AiGeneratorBlock({ canvas }) {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [_generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="block">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Text to Image Generator
      </h1>
      <GeneratorForm
        setGeneratedImage={setGeneratedImage}
        setGeneratedImageUrl={setGeneratedImageUrl}
        setLoading={setLoading}
        loading={loading}
      />
      <ImageDisplay image={generatedImage} loading={loading} canvas={canvas} />
    </div>
  );
}
export default AiGeneratorBlock;
