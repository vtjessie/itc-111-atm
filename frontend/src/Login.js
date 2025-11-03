import AtmPad from "./AtmPads";

import { useState } from "react";

function Login({ view, onFormSubmit }) {

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  const [showKeypad, setShowKeypad] = useState(false);
  const handleOpenKeypad = () => {
    if (pin.length === 4) setShowKeypad(true);

    else alert("Please enter a valid 4-digit PIN first!");
  };


  const handleSubmit = (e) => {
    e.preventDefault(); // stop page reload
    if (!username || pin.length !== 4) {
      return //alert("Please fill all fields");
    }

    //alert(`hello return ${username}. ... ${pin}`);
    onFormSubmit({ username, pin });

    // Optional: clear fields after submission
    //setUsername("");
    //setBalance("");
    //setPin("");
    //setDate("");

  };




  return (

    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
        required
      />

      {/* Button to show ATM Keypad */}
      {!showKeypad && (
        <button
          type="button"
          className="px-6 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={() => setShowKeypad(true)}
        >
          Open ATM Keypad
        </button>
      )}

      {showKeypad && (
        <AtmPad
          onClose={() => setShowKeypad(false)}
          onPinEntered={(pin) => {
            console.log(" PIN received from keypad:", pin);
            setPin(pin.toString()); // stores pin string (e.g. "1234")

            // Delay closing slightly so state updates fully
            setTimeout(() => {
              setShowKeypad(false);
            }, 200);
          }}
        />
      )}

      {/* Button label & color depend on view */}
      <button
        className={`px-4 py-2 rounded font-semibold w-64 ${view === "login"
            ? "bg-blue-600 rounded-lg hover:bg-blue-700"
            : "bg-red-600 rounded-lg hover:bg-red-700"
          }`}
        type="submit"
      >
        {view === "login" ? "Login" : "Delete"}
      </button>

    </form>


  );
}


export default Login; 
