import { useState } from "react";

function Header({ initialValue, undo, redo }) {
  const [title, setTitle] = useState(initialValue.product.title);

  return (
    <div className="flex items-center justify-between border rounded-md p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="border rounded-md px-3 py-2 font-semibold focus:outline-none"
          style={{
            width: `${Math.max(title.length, 5)}ch`,
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <div>
          <button onClick={undo} className="hover:text-gray-600 mr-3 text-3xl">
            ↩
          </button>
          <button onClick={redo} className="hover:text-gray-600 text-3xl">
            ↪
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
