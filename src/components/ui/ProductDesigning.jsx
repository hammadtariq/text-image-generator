function ProductDesigning() {
  return (
    <div>
      <h2 className="text-lg font-bold">
        Unisex Premium Hoodie | Cotton Heritage M2580
      </h2>
      <p className="text-gray-500">📌 Pricing & file guidelines</p>

      {/* Technique Selection */}
      <div className="mt-4 border-t pt-4">  
        <h3 className="font-semibold">Technique</h3>
        <div className="flex gap-2">
          <button className="border px-4 py-2 rounded-md bg-gray-100">
            DTG Printing
          </button>
          <button className="border px-4 py-2 rounded-md text-red-500 border-red-500">
            Embroidery
          </button>
        </div>
      </div>

      {/* Color Selection */}
      <div className="mt-4">
        <h3 className="font-semibold">Color</h3>
        <div className="flex gap-2">
          <div className="w-8 h-8 border rounded-full bg-black"></div>
          <div className="w-8 h-8 border rounded-full bg-gray-700"></div>
          <div className="w-8 h-8 border rounded-full bg-blue-700"></div>
          <div className="w-8 h-8 border rounded-full bg-green-700"></div>
        </div>
      </div>

      {/* Size Selection */}
      <div className="mt-4">
        <h3 className="font-semibold">Size</h3>
        <div className="flex gap-2">
          <label>
            <input type="checkbox" /> S
          </label>
          <label>
            <input type="checkbox" /> M
          </label>
          <label>
            <input type="checkbox" /> L
          </label>
          <label>
            <input type="checkbox" /> XL
          </label>
        </div>
      </div>
    </div>
  );
}
export default ProductDesigning;
