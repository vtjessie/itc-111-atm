import AtmPad from "./AtmPads";
import { useState } from "react";


function App() {
  const [view, setView] = useState("home"); // home | create | login | change | delete
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState("");
  const [date, setDate] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [encryptedPin, setEncryptedPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://127.0.0.1:5002";

  // Generic POST function
  const postData = async (url, data, method = "POST") => {
    try {
      const res = await fetch(`${API_URL}${url}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setMessage(result.message || result.error || "Unknown error");
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  const handleOpenKeypad = () => {
    if (pin.length === 4) setShowKeypad(true);
    
    else alert("Please enter a valid 4-digit PIN first!");
  };

  const handleCreate = (e) => {
    e.preventDefault();
    postData("/create-account", { username, pin, balance,Date });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    postData("/login", { username, pin });
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    postData("/change-pin", { username, old_pin: pin, new_pin: newPin });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    postData("/delete-account", { username, confirm: "DELETE" }, "DELETE");
  };

  const clearFields = () => {
    setUsername("");
    setPin("");
    setBalance("");
    setNewPin("");
    setMessage("");
  };

  return (    

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
    
      <h1 className="text-3xl font-bold mb-4">🏦 MCC Bank Portal</h1>

      <div className="flex space-x-2 mb-6">
        {["home", "create", "login", "change", "delete"].map((v) => (
          <button
            key={v}
            onClick={() => {
              setView(v);
              clearFields();
            }}
            className={`px-3 py-2 rounded ${
              view === v ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Home */}
      {view === "home" && (
        <p className="text-gray-300">
          Welcome! Select an action above to begin.
        </p>
      )}

      {/* Create Account */}
      {view === "create" && (
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            type="submit"
          >
            Create Account
          </button>
     
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
        
      {/* Button to show ATM Keypad */}
      {!showKeypad && (
        <button
          className="px-6 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={() => setShowKeypad(true)}
        >
          Open ATM Keypad
        </button>
      )}
        </div>
      )}

      {/* Keypad */}
      {showKeypad && (
               <AtmPad
          onClose={() => setShowKeypad(false)}
          onPinEntered={(value) => {
            setPin(value);
            setShowKeypad(false);
          }}
        />
      )}

      {/* Show encrypted PIN if exists */}
      {encryptedPin && (
        <div className="text-sm mt-4 text-blue-400 break-all">
          <p>Encrypted PIN:</p>
          <p>{encryptedPin}</p>
        </div>
      )}
        </form>
      )}

      {/* Login */}
      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            type="submit"
          >
            Login
          </button>
        </form>
      )}

      {/* Change PIN */}
      {view === "change" && (
        <form onSubmit={handleChangePin} className="space-y-3">
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
            placeholder="Current PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
            placeholder="New PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
          />
          <button
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            type="submit"
          >
            Change PIN
          </button>
        </form>
      )}

      {/* Delete Account */}
      {view === "delete" && (
        <form onSubmit={handleDelete} className="space-y-3">
          <input
            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            type="submit"
          >
            Delete Account
          </button>
        </form>
      )}

      {/* Response Message */}
      {message && <p className="mt-6 text-green-400">{message}</p>}
    </div>
  );
}

export default App;
