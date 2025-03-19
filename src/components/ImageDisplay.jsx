const ImageDisplay = ({ image, loading }) => {
    return (
      <div className="mt-8 w-full max-w-md">
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {image && !loading && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img src={image} alt="Generated" className="w-full rounded-lg" />
            <a
              href={image}
              download="generated-image.png"
              className="block mt-4 text-center text-blue-500 hover:underline"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    );
  };
  
  export default ImageDisplay;