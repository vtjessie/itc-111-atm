import AtmPad from "./AtmPads";

import { useState } from "react";

function CheckBalance({ onFormSubmit }) {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || pin.length !== 4) {

      return //alert("Please fill all fields");
    }
    onFormSubmit({ username, pin });

    // Optional: clear fields after submission
    //setUsername("");
    //setBalance("");
    setPin("");

  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
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
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <button
          className="mt-4 text-green-400 hover:bg-blue-700 px-4 py-2 rounded"
          type="submit"
        >
          Check Balance
        </button>
      </form>

    </div>
  );

}


export default CheckBalance;


