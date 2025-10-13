import React, { useState } from "react";

function AtmPadR() {
  const [pin, setPin] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [encrypted, setEncrypted] = useState("");
  const [error, setError] = useState("");

  const handlePress = (key) => {
    if (pin.length < 4 && typeof key === "number") {
      setPin((prev) => prev + key.toString());
    }
  };

  const handleClear = () => {
    setPin("");
    setEncrypted("");
    setError("");
  };

  const handleEnter = async () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5002/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: pin }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setEncrypted(data.encrypted_number || "No data received");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="bg-[#1a1f2b] p-8 rounded-3xl shadow-2xl border border-gray-700 w-[340px] text-center">

        {/* Step 1: Input Form */}
        {!showKeypad && (
          <div className="space-y-4">
           
            <button
              className="block mx-auto mt-4 px-6 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700"
              onClick={() => setShowKeypad(true)}
            >
              Open ATM Keypad
            </button>
          </div>
        )}

        {/* Step 2: ATM Keypad */}
        {showKeypad && (
          <>
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

            {/* Keypad Buttons */}
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

            {/* Result */}
            {encrypted && (
              <div className="mt-4 text-xs text-gray-300 break-all">
                <p className="text-blue-400 font-semibold">Encrypted PIN:</p>
                <p>{encrypted}</p>
              </div>
            )}