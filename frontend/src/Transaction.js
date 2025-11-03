import AtmPad from "./AtmPads";

import { useState } from "react";


function Transaction({ onFormSubmit }) {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [tran, setTran] = useState(null);
    //const [showTransactionMenu, setShowTransactionMenu] = useState(false);
    const [transactionType, setTransactionType] = useState("");
    const [amount, setAmount] = useState("");
    //const [balance, setBalance] = useState(0.0);


    const handleSubmit = (e) => {
        e.preventDefault();

        //setBalance(null);

        if (!username || pin.length !== 4) {

            return //alert("Please fill all fields");
        }
        onFormSubmit({ username, pin, amount, transactionType });

        // Optional: clear fields after submission
        setUsername("");
        //setBalance("");
        setPin("");

    };

    const clearFields = () => {
        setUsername("");
        setPin("");
        //setBalance("");
        //setNewPin("");
        //setAmount("")
        //setMessage("");
        //setFormData("");
        setTransactionType("")
    };

    return (
        <div>

            <div className="flex space-x-2 mb-6 items-center justify-center ">
                {["withdraw", "deposit"].map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            setTran(s);
                            clearFields();
                            //setShowTransactionMenu(false);
                            setTransactionType(s);
                        }}
                        className={`px-3 py-2 rounded ${tran === s ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        {s.toUpperCase()}
                    </button>


                )

                )}

            </div>



            {transactionType && (

                <form onSubmit={handleSubmit}
                    className="space-y-3  flex flex-col items-center"
                >

                    <div className="text-xl mt-4    text-center">
                        {transactionType === "withdraw" ? "Withdraw" : "Deposit"} Funds
                    </div>
                    <h2>
                        <input
                            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            maxLength={4}
                            className="p-2 rounded bg-gray-800 border border-gray-600 w-64 text-center tracking-widest"
                            placeholder="Enter 4-digit PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                            required
                        />

                        <input
                            type="number"
                            className="p-2 rounded bg-gray-800 border border-gray-600 w-64"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />

                        <button
                            className={`${transactionType === "withdraw"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                                } px-4 py-2 rounded`}
                            type="submit"
                        >
                            {transactionType === "withdraw" ? "Withdraw" : "Deposit"}
                        </button>
                    </h2>

                </form>

            )}
        </div>
    )
}

export default Transaction;

