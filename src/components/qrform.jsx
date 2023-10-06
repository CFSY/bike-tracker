import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";

function QRForm({ setData }) {
  const [id, setId] = useState("");
  const inputRef = useRef(null);

  function handleIdChange(event) {
    setId(event.target.value);
    setData({ id: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    inputRef.current.blur();
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded shadow-md p-3">
      <form className="p-3" onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Enter unique ID:
          <input
            ref={inputRef}
            type="text"
            value={id}
            onChange={handleIdChange}
            className="w-full px-3 py-2 mt-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </label>
      </form>
      <div className="p-3">
        <QRCode value={id} />
      </div>
    </div>
  );
}

export default QRForm;
