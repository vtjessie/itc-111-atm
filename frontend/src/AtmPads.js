import React, { useState, useEffect } from "react";

function AtmPad({ onClose, onPinEntered }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");


  const handlePress = (key) => {
    if (pin.length < 4 && typeof key === "number") {
      setPin((prev) => prev + key.toString());
    }
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const handleEnter = async () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits.");
      return;
    }
    onPinEntered(pin); // ✅ send pin back to App.js
    setError("");
  };
    
  return (
    <div className="bg-[#1a1f2b] p-8 rounded-3xl shadow-2xl border border-gray-700 w-[340px] text-center animate-fade-in">
      <div className="bg-black rounded-xl p-4 shadow-inner border border-gray-600">
        <h2 className="text-green-400 font-semibold text-lg mb-2">
          MCC-TEAM ATM
        </h2>
        <p className="text-gray-300 text-sm">Enter your PIN</p>
        <div className="flex justify-center mt-3 space-x-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < pin.length ? "bg-green-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 bg-gray-800 p-3 rounded-lg border border-gray-700">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0, "Enter"].map((key) => (
          <button
            key={key}
            onClick={() =>
              key === "Clear"
                ? handleClear()
                : key === "Enter"
                ? handleEnter()
                : handlePress(key)
            }
            className={`py-3 rounded-lg text-lg font-semibold shadow-md transition-all ${
              key === "Clear"
                ? "bg-red-600 hover:bg-red-700"
                : key === "Enter"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

      <button
        className="mt-5 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
        onClick={onClose}
      >
        ← Back to PIN Input
      </button>
    </div>
  );
}

export default AtmPad;