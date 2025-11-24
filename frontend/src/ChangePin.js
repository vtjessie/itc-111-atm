import AtmPad from "./AtmPads";

import { useState } from "react";

function ChangePin({ onFormSubmit }) {
    const [showKeypad, setShowKeypad] = useState(false);
    const [showNewKeypad, setShowNewKeypad] = useState(false)

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [newPin, setNewPin] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || pin.length !== 4 || newPin.length !== 4) {
            //alert("Please enter your username and a 4-digit PIN.");
            return;
        }

        onFormSubmit({ username, old_pin: pin, new_pin: newPin });

        // Optional: clear fields after submission
        setUsername("");
        setPin("");

    };

    const clearFields = () => {
        setUsername("");
        setPin("");
    };

    return (
        <div>
            <div className="flex space-x-2 mb-6"></div>


            <form onSubmit={handleSubmit} className="space-y-3  flex flex-col items-center"
            >
                <p>
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
                            CURRENT PIN
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
                                }, 100);
                            }}
                        />
                    )}

                    {!showNewKeypad && (
                        <button
                            type="button"
                            className="px-6 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
                            onClick={() => setShowNewKeypad(true)}
                        >
                            NEW PIN
                        </button>
                    )}
                    {showNewKeypad && (

                        <AtmPad
                            onClose={() => setShowNewKeypad(false)}
                            onPinEntered={(newPin) => {
                                console.log(" PIN received from keypad:", newPin);
                                setNewPin(newPin.toString()); // stores pin string (e.g. "1234")

                                // Delay closing slightly so state updates fully
                                setTimeout(() => {
                                    setShowNewKeypad(false);
                                }, 100);
                            }}
                        />
                    )}

                    <button
                        className="bg-yellow-600 rounded-lg hover:bg-yellow-700  px-4 py-2 rounded "
                        type="submit"
                    >
                        Change PIN
                    </button>

                </p>
                
            </form>

        </div>
    )
}

export default ChangePin