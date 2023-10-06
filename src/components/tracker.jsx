import React, { useState } from "react";

function Tracker({ data }) {
  const [armed, setArmed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between bg-white rounded shadow-md p-3 h-[50vh] w-[90vw]">
      <div className="items-left w-[100%]">
        <h1 className="text-2xl font-bold mb-3">Device ID: {data.id}</h1>
        <h1 className="text-2xl font-bold mb-3">
          Status: {armed ? "Armed" : "Disarmed"}
        </h1>
      </div>
      <button
        onClick={() => setArmed(!armed)}
        className={`mt-5 text-white font-bold py-2 px-4 rounded w-32 ${
          armed
            ? "bg-red-500 active:bg-red-700"
            : "bg-green-500 active:bg-green-700"
        }`}
      >
        {armed ? "Disarm" : "Arm"}
      </button>
    </div>
  );
}

export default Tracker;
