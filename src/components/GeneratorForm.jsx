import { useState } from 'react';
import axios from 'axios';

const token = import.meta.env.VITE_HF_TOKEN;

const GeneratorForm = ({ setGeneratedImage, setLoading, loading }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [resolution, setResolution] = useState('1024x1024'); // Default to 1024x1024 for print quality
  const [model, setModel] = useState('black-forest-labs/FLUX.1-dev'); // Default to FLUX since it's currently working
  const [errorMessage, setErrorMessage] = useState('');

  // Base negative prompt for living things with proper anatomy (used by Stable Diffusion models)
  const baseNegativePrompt =
    'blurry, low quality, distorted, deformed, extra limbs, missing limbs, unnatural proportions, unrealistic anatomy, pixelated, noisy, artifacts, overexposed, underexposed, low resolution, extra fingers, missing fingers, fused limbs, unnatural skin texture, unrealistic lighting, text, watermark, logo, background clutter';

  // Adjust negative prompt based on style
  const getNegativePrompt = () => {
    let negativePrompt = baseNegativePrompt;
    if (style === 'cartoon') {
      negativePrompt = negativePrompt.replace('cartoonish', '');
    } else if (style === 'abstract') {
      negativePrompt = negativePrompt.replace('abstract', '');
    } else if (style === 'realistic') {
      negativePrompt += ', cartoonish, abstract, surreal';
    }
    return negativePrompt;
  };

  // Check if the model supports negative prompts
  const supportsNegativePrompt = (model) => {
    return model !== 'black-forest-labs/FLUX.1-dev';
  };

  // Incorporate style and anatomical guidance into the prompt
  const getStyledPrompt = () => {
    let finalPrompt = `${style} ${prompt}`;
    // For FLUX.1-dev, append anatomical guidance since it doesn't support negative_prompt
    if (!supportsNegativePrompt(model)) {
      const anatomicalGuidance = ', with realistic proportions, correct anatomy, five fingers per hand, no extra limbs, no missing limbs, no distorted features, high quality, vibrant colors';
      finalPrompt += anatomicalGuidance;
    }
    return finalPrompt;
  };

  // Get resolution options based on model
  const getResolutionOptions = () => {
    if (model === 'stabilityai/stable-diffusion-xl-base-1.0') {
      return ['768x768', '1024x1024']; // SDXL performs best at 768x768 or higher
    }
    return ['512x512', '768x768', '1024x1024']; // FLUX and SD v1.5 support up to 1024x1024
  };

  // Get model-specific parameters
  const getModelParameters = (width, height) => {
    const parameters = {
      width: width,
      height: height,
    };

    // Add negative_prompt for supported models
    if (supportsNegativePrompt(model)) {
      parameters.negative_prompt = getNegativePrompt();
    }

    // Model-specific parameters
    if (model === 'black-forest-labs/FLUX.1-dev') {
      parameters.guidance_scale = 3.5; // Recommended for FLUX
      parameters.num_inference_steps = 4; // FLUX is optimized for 1-4 steps; use max for better quality
    } else if (model === 'stabilityai/stable-diffusion-xl-base-1.0') {
      parameters.guidance_scale = 9.0; // Higher for SDXL to ensure prompt adherence
      parameters.num_inference_steps = 50; // More steps for high-quality output
    } else {
      // runwayml/stable-diffusion-v1-5
      parameters.guidance_scale = 7.5;
      parameters.num_inference_steps = 50;
    }

    return parameters;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Parse resolution
    const [width, height] = resolution.split('x').map(Number);

    // Validate resolution based on model
    if (model === 'black-forest-labs/FLUX.1-dev' && (width > 1024 || height > 1024)) {
      setErrorMessage('FLUX.1-dev supports resolutions up to 1024x1024. Please select a lower resolution.');
      setLoading(false);
      return;
    }
    if (model === 'stabilityai/stable-diffusion-xl-base-1.0' && (width < 768 || height < 768)) {
      setErrorMessage('Stable Diffusion XL 1.0 performs best at resolutions of 768x768 or higher.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          inputs: getStyledPrompt(),
          parameters: getModelParameters(width, height),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      if (error.response) {
        if (error.response.status === 503) {
          setErrorMessage(
            `The model ${model} is currently unavailable (503 Service Unavailable). Try selecting a different model or try again later.`
          );
        } else if (error.response.status === 401) {
          setErrorMessage('Authentication failed. Please check your API token.');
        } else if (error.response.status === 429) {
          setErrorMessage('Rate limit exceeded. Please wait a few minutes and try again.');
        } else {
          setErrorMessage(`Failed to generate image with ${model}. Error: ${error.message}`);
        }
      } else {
        setErrorMessage('Network error. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onPromptChange = (e) => {
    setPrompt(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
      {model === 'black-forest-labs/FLUX.1-dev' && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
          Note: FLUX.1-dev does not support negative prompts, so anatomical corrections are limited. Please include detailed anatomical guidance in your prompt (e.g., "with realistic proportions, five fingers per hand").
        </div>
      )}
      <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
        Post-Processing Tip: For print-ready images, consider removing the background using a tool like Printify or iFoto, and upscale to 2048x2048 if needed for larger prints.
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prompt">
          Image Description
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={onPromptChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          placeholder="E.g., a bear wearing a suit, with realistic proportions, correct anatomy, five fingers per hand, vibrant colors"
          rows="10"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
          Model (Free on Hugging Face API)
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        >
          <option value="black-forest-labs/FLUX.1-dev">FLUX.1-dev (Black Forest Labs)</option>
          <option value="runwayml/stable-diffusion-v1-5">Stable Diffusion v1.5 (RunwayML)</option>
          <option value="stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL 1.0 (Stability AI)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="style">
          Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        >
          <option value="realistic">Realistic</option>
          <option value="cartoon">Cartoon</option>
          <option value="abstract">Abstract</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resolution">
          Resolution
        </label>
        <select
          id="resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        >
          {getResolutionOptions().map((res) => (
            <option key={res} value={res}>{res}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
    </form>
  );
};

export default GeneratorForm;