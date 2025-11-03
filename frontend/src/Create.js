import AtmPads from "./AtmPads";

import { useState } from "react";

function Create({ onFormSubmit }) {

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState("");
  const [date, setDate] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const handleOpenKeypad = () => {
    if (pin.length === 4) setShowKeypad(true);

    else alert("Please enter a valid 4-digit PIN first!");
  };


  const handleSubmit = (e) => {
    e.preventDefault(); // stop page reload
    if (!username || !balance) return alert("Please fill all fields");

    // send the form data to App.js

    onFormSubmit({ username, pin, balance, Date });
    console.log("Props received by CreateForm:", onFormSubmit);
    // Optional: clear fields after submission
    setUsername("");
    setBalance("");
    setPin("");
    setDate("");

  };

  return (


    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)

        }
        required
      />

      <input
        className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
        placeholder="Initial Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        required
      />
      {/* 📅 Date picker */}
      <input
        type="date"
        className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Input form */}
      {!showKeypad && (
        <div className="flex flex-col items-center space-y-3">
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64 text-center"
            placeholder="Enter 4-digit PIN"
            value={pin}
            maxLength={4}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />         
        </div>
      )}
      <button
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        type="submit"
      >
        Create Account
      </button>

    </form>

  );
}


export default Create; 