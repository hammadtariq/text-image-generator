import { Button } from "antd";

export default function VariantSelector({ variantImages, selectedVariantId, setSelectedVariantId }) {
  return (
    <div className="mb-4">
      {variantImages.map((variant) => (
        <Button
          key={variant.id}
          type={selectedVariantId === variant.id ? "primary" : "default"}
          shape="round"
          onClick={() => setSelectedVariantId(variant.id)}
        >
          {variant.label}
        </Button>
      ))}
    </div>
  );
}
