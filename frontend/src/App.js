import AtmPad from "./AtmPads";

import ChangePin from "./ChangePin";
import Create from "./Create";
import CheckBalance from "./CheckBalance.js";
import Transaction from "./Transaction.js";
import Login from "./Login.js";
import { useState } from "react";


function App() {
  

  const [view, setView] = useState("home"); // home | create | login | change | delete
  const [tran, setTran] = useState(null);

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState(0.0);

  const [message, setMessage] = useState("");

  //const [activeTab, setActiveTab] = useState("home");
  const API_URL = "http://127.0.0.1:5002";



  // Generic POST function
  const postData = async (url, data, method = "POST") => {
    //const payload = { username, balance, pin,date };
    try {
      const res = await fetch(`${API_URL}${url}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setMessage(result.message || result.error || "Unknown error");
      console.log("✅ Server response:", result);
      return result;

    } catch (err) {
      setMessage("Server error: " + err.message);
      return { error: err.message };
    }
  };


  const handleCreate = async (data) => {
    //data.preventDefault();
    //setFormData(data);

    const result = await postData("/create-account", data);
    //alert(`CREATE  ${data.username}`);
    if (result.error) {
      setMessage(` Failed: ${result.error}`);
    } else {
      setMessage(" Account created successfully!");
    }
  };

  const handleTransaction = async (data) => {
    //e.preventDefault();
    if (!data.username || !data.pin || !data.amount) {
      alert("Please fill all fields!");
      return;
    }
    

    const res = postData("/update-balance", data);
    if (res.error) {
      setMessage(` Failed: ${res.message}`);
    }
  }


  const checkBalance = async (data) => {
    //const { username, pin } = data;
    //e.preventDefault();
    if (!data.username || data.pin.length !== 4) {
      alert("Please fill all fields!");
      return;
    }
    //alert(`Your!!!!! user is $${data.username} !!!!${data.pin}`)
    const res = await postData("/balance", data);

    if (res.error) {
      alert(res.error || "Failed to fetch balance");
      return;
    }
    //setUsername (data.username) ;           
    setBalance(res.balance);

  };

  const handleLogin = (data) => {
    // e.preventDefault();
    if (!data.username || data.pin.length !== 4) {

      return;
    }
    if(view=="login")
      postData("/login", data);
    else if(view=="delete"){
   
      postData("/delete-account", { username:data.username ,pin:data.pin , confirm: "DELETE" }, "DELETE");
    // Delay closing slightly so state updates fully
                                setTimeout(() => {
                                 
                                }, 100);
    
      return
    }
  };

  const handleChangePin = (data) => {
    //e.preventDefault();
    if (!data.username || data.old_pin.length !== 4 || data.new_pin.length !== 4) {
      //alert("Please enter your username and a 4-digit PIN.");
      return;
    }
    postData("/change-pin", data);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    postData("/delete-account", { username, confirm: "DELETE" }, "DELETE");
  };

  const clearFields = () => {
    //setUsername("");
    //setPin("");
    //setBalance("");
    //setNewPin("");
    //setAmount("")
    setMessage("");
 
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-4">🏦 MCC Bank Portal</h1>

      <div className="flex space-x-2 mb-6">
        {["home", "create", "transaction", "login", "checkbalance", "change", "delete"].map((v) => (
          <button
            key={v}
            onClick={() => {
              setView(v);
              clearFields();
              
            }}
            className={`px-3 py-2 rounded ${view === v ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="text-gray-400 text-sm">
        Old PIN: {pin} | Username: {username}
      </p>

      {/* Home */}
      {view === "home" && (
        <p className="text-gray-300">
          Welcome! Select an action above to begin.
        </p>
      )}

      {/* Create Account */}
      {view === "create" &&
        (
          <Create onFormSubmit={handleCreate} />)
      }

      {/* Login */}
      {view === "loggin" && (
        <Login onFormSubmit={handleLogin} />
      )}

      {/*Check Balance*/}

      {view === "checkbalance" && (

        <div>
          <CheckBalance onFormSubmit={checkBalance}
          />
          <p className="mt-4 text-green-400">
            💰 Your Balance: ${balance} <br />
          </p>
        </div>
      )}

      {/* 💵 Transaction Section */}
      {view === "transaction" && (

        <Transaction onFormSubmit={handleTransaction} />
      )}




      {/* Change PIN */}
      {view === "change" && (
            <ChangePin onFormSubmit={handleChangePin} />
      )}


      {/* Delete Account */}
      {/* DYNAMICALLY SHOW LOGIN COMPONENT */}
       {/* Render Login component */}
      {(view === "login" || view === "delete") && (
        <Login view={view} onFormSubmit={handleLogin} />
      )}
      
      {/* Response Message */}
      {message && <p className="mt-6 text-green-400">{message}</p>}
    </div
    >
  );
}

export default App;
