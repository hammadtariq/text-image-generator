// components/GeneratorForm.jsx
import { useState } from "react";
import { Form, Input, Select, Button, Alert, Typography } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;
const { Paragraph } = Typography;

const token = import.meta.env.VITE_HF_TOKEN;

const GeneratorForm = ({
  setGeneratedImage,
  setGeneratedImageUrl,
  setLoading,
  loading,
}) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [resolution, setResolution] = useState("1024x1024");
  const [model, setModel] = useState("black-forest-labs/FLUX.1-dev");
  const [errorMessage, setErrorMessage] = useState("");

  // Base negative prompt for living things with proper anatomy (used by Stable Diffusion models)
  const baseNegativePrompt =
    "blurry, low quality, distorted, deformed, extra limbs, missing limbs, unnatural proportions, unrealistic anatomy, pixelated, noisy, artifacts, overexposed, underexposed, low resolution, extra fingers, missing fingers, fused limbs, unnatural skin texture, unrealistic lighting, text, watermark, logo, background clutter";

  // Adjust negative prompt based on style
  const getNegativePrompt = () => {
    let negativePrompt = baseNegativePrompt;
    if (style === "cartoon") {
      negativePrompt = negativePrompt.replace("cartoonish", "");
    } else if (style === "abstract") {
      negativePrompt = negativePrompt.replace("abstract", "");
    } else if (style === "realistic") {
      negativePrompt += ", cartoonish, abstract, surreal";
    }
    return negativePrompt;
  };

  // Check if the model supports negative prompts
  const supportsNegativePrompt = (model) => {
    return model !== "black-forest-labs/FLUX.1-dev";
  };

  // Incorporate style and anatomical guidance into the prompt
  const getStyledPrompt = () => {
    let finalPrompt = `${style} ${prompt}`;
    // For FLUX.1-dev, append anatomical guidance since it doesn't support negative_prompt
    if (!supportsNegativePrompt(model)) {
      const anatomicalGuidance =
        ", with realistic proportions, correct anatomy, five fingers per hand, no extra limbs, no missing limbs, no distorted features, high quality, vibrant colors";
      finalPrompt += anatomicalGuidance;
    }
    return finalPrompt;
  };

  // Get resolution options based on model
  const getResolutionOptions = () => {
    if (model === "stabilityai/stable-diffusion-xl-base-1.0") {
      return ["768x768", "1024x1024"]; // SDXL performs best at 768x768 or higher
    }
    return ["512x512", "768x768", "1024x1024"]; // FLUX and SD v1.5 support up to 1024x1024
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
    if (model === "black-forest-labs/FLUX.1-dev") {
      parameters.guidance_scale = 3.5; // Recommended for FLUX
      parameters.num_inference_steps = 4; // FLUX is optimized for 1-4 steps; use max for better quality
    } else if (model === "stabilityai/stable-diffusion-xl-base-1.0") {
      parameters.guidance_scale = 9.0; // Higher for SDXL to ensure prompt adherence
      parameters.num_inference_steps = 50; // More steps for high-quality output
    } else {
      // runwayml/stable-diffusion-v1-5
      parameters.guidance_scale = 7.5;
      parameters.num_inference_steps = 50;
    }

    return parameters;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    // Parse resolution
    const [width, height] = resolution.split("x").map(Number);

    // Validate resolution based on model
    if (
      model === "black-forest-labs/FLUX.1-dev" &&
      (width > 1024 || height > 1024)
    ) {
      setErrorMessage(
        "FLUX.1-dev supports resolutions up to 1024x1024. Please select a lower resolution."
      );
      setLoading(false);
      return;
    }
    if (
      model === "stabilityai/stable-diffusion-xl-base-1.0" &&
      (width < 768 || height < 768)
    ) {
      setErrorMessage(
        "Stable Diffusion XL 1.0 performs best at resolutions of 768x768 or higher."
      );
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
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setGeneratedImageUrl(imageUrl);
      setGeneratedImage(imageUrl); // For parent component
    } catch (error) {
      console.error("Error generating image:", error);
      if (error.response) {
        if (error.response.status === 503) {
          setErrorMessage(
            `The model ${model} is currently unavailable (503 Service Unavailable). Try selecting a different model or try again later.`
          );
        } else if (error.response.status === 401) {
          setErrorMessage(
            "Authentication failed. Please check your API token."
          );
        } else if (error.response.status === 429) {
          setErrorMessage(
            "Rate limit exceeded. Please wait a few minutes and try again."
          );
        } else {
          setErrorMessage(
            `Failed to generate image with ${model}. Error: ${error.message}`
          );
        }
      } else {
        setErrorMessage(
          "Network error. Please check your internet connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
      }}
    >
      {errorMessage && (
        <Form.Item>
          <Alert message={errorMessage} type="error" showIcon />
        </Form.Item>
      )}

      {model === "black-forest-labs/FLUX.1-dev" && (
        <Form.Item>
          <Alert
            message="Note: FLUX.1-dev does not support negative prompts, so anatomical corrections are limited. Please include detailed anatomical guidance in your prompt (e.g., 'with realistic proportions, five fingers per hand')"
            type="warning"
          />
        </Form.Item>
      )}

      <Form.Item>
        <Alert
          message="Post-Processing Tip: For print-ready images, consider removing the background and upscaling to 2048x2048 if needed for larger prints."
          type="info"
        />
      </Form.Item>

      <Form.Item
        label="Image Description"
        name="prompt"
        rules={[{ required: true, message: "Please enter a description" }]}
      >
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., a bear wearing a suit, with realistic proportions, correct anatomy, five fingers per hand, vibrant colors"
          rows={3}
        />
      </Form.Item>

      <Form.Item label="Style">
        <Select value={style} onChange={(value) => setStyle(value)}>
          <Option value="realistic">Realistic</Option>
          <Option value="cartoon">Cartoon</Option>
          <Option value="abstract">Abstract</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Model">
        <Select value={model} onChange={(value) => setModel(value)}>
          <Option value="black-forest-labs/FLUX.1-dev">FLUX.1-dev</Option>
          <Option value="stabilityai/stable-diffusion-xl-base-1.0">
            Stable Diffusion XL 1.0
          </Option>
          <Option value="stabilityai/stable-diffusion-2">
            Stable Diffusion 2
          </Option>
        </Select>
      </Form.Item>

      <Form.Item label="Resolution">
        <Select value={resolution} onChange={(value) => setResolution(value)}>
          {getResolutionOptions().map((res) => (
            <Option key={res} value={res}>
              {res}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{ height: 40 }}
        >
          Generate Image
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GeneratorForm;
