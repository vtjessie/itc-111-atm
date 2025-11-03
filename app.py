from flask import Flask, jsonify, request
from flask_cors import CORS 
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad,unpad
from Crypto.Random import get_random_bytes
from datetime import datetime
import base64

# 32 bytes for AES-256
KEY = b"mysecretpassword" * 2  # 32 bytes for AES-256

app = Flask(__name__)
CORS(app)

# Temporary in-memory storage (use database or JSON file later)
user_data = {}
MAX_ATTEMPTS = 3

def encrypt_number(number: str) -> str:
    iv = get_random_bytes(AES.block_size)
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    encrypted_bytes = cipher.encrypt(pad(number.encode("utf-8"), AES.block_size))
    encoded_data = base64.b64encode(iv + encrypted_bytes).decode("utf-8")
    return encoded_data

def decrypt_number(encoded_data: str) -> str:
    # Step 1. Decode from Base64 back to bytes
    raw_data = base64.b64decode(encoded_data)

    # Step 2. Extract IV (first 16 bytes) and ciphertext (rest)
    iv = raw_data[:AES.block_size]
    encrypted_bytes = raw_data[AES.block_size:]

    # Step 3. Recreate the cipher using same key + IV
    cipher = AES.new(KEY, AES.MODE_CBC, iv)

    # Step 4. Decrypt and unpad to get original plaintext
    decrypted = unpad(cipher.decrypt(encrypted_bytes), AES.block_size)

    return decrypted.decode("utf-8")

def found(username,pin):
   if username in user_data:
       encoded_number = user_data[username]["encode"]
       pin_d = int(  decrypt_number(encoded_number))
       if pin_d != pin :       
        return 1;
    
   else:
       return 1;
   return 0;


@app.route('/user_data_length')
def get_user_data_length():
    return jsonify({"length": len(user_data)})


# POST endpoint demo
@app.route('/greet', methods=['POST'])
def greet_user():
    data = request.get_json()  # get JSON from request body
    name = data.get("name", "Guest")  # extract 'name' or default to Guest
    return jsonify({"message": f"Hello, {name}! Welcome to MCC Project."})

print(" Flask server ready")

@app.route('/create-account', methods=['POST'])
def api_create_account():
    data = request.get_json()
    print("📩 Data received in Flask:", data)
    username = data.get("username")
    print(f"hello :${username}")
    pin = data.get("pin")
    balance = data.get("balance", 0.0)
    date = data.get("date")
    print(" Entering ready")
    if username in user_data:
        print(username)
        return jsonify({"error": "Username already exists"}), 400

    if not pin or len(pin) != 4 or not pin.isdigit():
        return jsonify({"error": "PIN must be 4 digits"}), 400

    encoded_data =  encrypt_number(pin) 
    user_data[username] = {
        
        "encode":encoded_data,
        "balance": float(balance),
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "transactions":  [],
    }
    print(user_data[username])
    return jsonify({"message": f"Account '{username}' created successfully."}), 201

@app.route('/update-balance', methods=['POST'])
def update_balance():
        
        data = request.get_json()
        print("📩 Data received in Flask:", data)

        username = data.get("username")

        balance  = float(data.get("amount",0.0))
        tranType = data.get("transactionType")
        print(username,balance,user_data[username])
        if (tranType == "withdraw" ):
            if(balance> user_data[username]["balance"] ):
               return jsonify({"message": "Not Enough Money"}), 405
            else:
                user_data[username]["balance"]=user_data[username]["balance"]-float(balance)

        else:               
            user_data[username]["balance"]=user_data[username]["balance"]+float(balance)
        return jsonify({"message": "Transaction updated successfully"}), 200


@app.route('/login', methods=['POST'])
def api_login():
    
    data = request.get_json()
    print("📩 Data received in Flask:", data)
    username = data.get("username")   

    #username = " ".join(data.get("username", "").split())
    if username not in user_data:
            return jsonify({"error": "User - not found"}), 404
     
    pin = int(data.get("pin"))
    if (found(username,pin)  == 1):
       return jsonify({"error": "Invalid PIN"}), 401

    return jsonify({"message": "Login successful"}), 200


@app.route('/balance', methods=['POST'])
def api_check_balance():
    data = request.get_json()
    username = data.get("username")
    
    #  Check if user exists
    if username not in user_data:
        return jsonify({"error": "User not found"}), 404

    #  Verify PIN
    pin = int(data.get("pin"))
    if (found(username,pin)  == 1):
       return jsonify({"error": "Invalid PIN"}), 401
     
    #  Send current balance
    balance = user_data[username]["balance"] 
    print(".hhhhh...",user_data[username]["balance"]);
    print(".HHHHHH...", balance);
    balan  = str(balance)
    # "message": "Balance retrieved successfully"
    # "balance": "balance"
    return jsonify({
       
       "message": "Balance retrieved successfully",
       "balance": balance
        
    }), 200 

#  Change PIN (POST)
@app.route('/change-pin', methods=['POST'])
def api_change_pin():
    data = request.get_json()
    username = data.get("username")
    old_pin =  data.get("old_pin")
    new_pin =  data.get("new_pin")
     
     
    if username not in user_data:
        return jsonify({"error": "User not found"}), 404

    old_pin = int(data.get("old_pin"))
    if (found(username,old_pin)  == 1):
       return jsonify({"error": "Invalid PIN"}), 401

    if not new_pin or len(new_pin) != 4 or not new_pin.isdigit():
        return jsonify({"error": "New PIN must be 4 digits"}), 400
    encoded_data = encrypt_number(new_pin)
    user_data[username]["encode"] = encoded_data
    return jsonify({"message": "PIN updated successfully"}), 200


#  Delete account (DELETE)
@app.route('/delete-account', methods=['DELETE'])
def api_delete_account():
    data = request.get_json()
    username = data.get("username")
    #pin =data.get("pin")
    confirm = data.get("confirm")

    if username not in user_data:
        return jsonify({"error": "User not found"}), 404
    pin = int(data.get("pin"))
    print(".PPPPP...", pin);
    if (found(username,pin)  == 1):
       return jsonify({"error": "Invalid PIN"}), 401
    if confirm != "DELETE":
        return jsonify({"error": "Deletion not confirmed"}), 400

    del user_data[username]
    return jsonify({"message": f"Account '{username}' deleted successfully."}), 200


if __name__ == '__main__':
    app.run(port=5002, debug=True)
