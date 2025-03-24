function Footer() {
    return (
      <div className="flex items-center justify-between border-t p-3 bg-white">
        {/* Left Side: Product Details */}
        <div className="flex items-center gap-3">
          <img 
            src="/product-image.png" 
            alt="Product" 
            className="w-10 h-10 object-cover border rounded"
          />
          <div>
            <p className="text-sm text-gray-700 font-medium">
              Unisex Premium Hoodie | Cotton Heritage M2580
            </p>
            <div className="flex items-center gap-1">
              <p className="text-lg font-semibold">$25.45</p>
              <span className="text-gray-400 text-xs">ⓘ</span>
            </div>
          </div>
        </div>
  
        {/* Right Side: Disabled Button */}
        <button 
          className="bg-red-300 text-white px-4 py-2 rounded-md cursor-not-allowed"
          disabled
        >
          Save to templates
        </button>
      </div>
    );
  }
  
  export default Footer;
  