# accounts.py
# Handles user account creation, login, PIN change, and deletion

from helpers import safe_float_input, now_ts, today_str

def create_account(user_data):
    # Handles new user creation: username, PIN, and initial balance.
    username = input("Create a username: ").strip()

    if username in user_data:
        print("Username already exists.\n")
        return

    # Set PIN
    while True:
        pin = input("Set a 4-digit PIN: ").strip()
        if len(pin) == 4 and pin.isdigit():
            break
        print("Invalid PIN. Must be 4 digits.")

    # Set initial balance
    while True:
        balance = safe_float_input("Enter initial balance: $")
        if balance is not None and balance >= 0:
            break
        print("Invalid balance. Must be non-negative.")

    user_data[username] = {
        "pin": pin,
        "balance": round(balance, 2),
        "transactions": [],
        "withdrawn_today": 0.0,
        "withdraw_date": today_str()
    }

    # Log initial deposit if any
    if balance > 0:
        user_data[username]["transactions"].append({
            "type": "initial deposit",
            "amount": balance,
            "timestamp": now_ts()
        })

    print(f"Account '{username}' created successfully.\n")


def login(user_data, max_attempts):
    """Logs in a user by validating username and PIN."""
    username = input("Enter username: ").strip()

    if username not in user_data:
        print("User not found.\n")
        return None

    for attempt in range(max_attempts):
        pin = input("Enter PIN: ").strip()
        if pin == user_data[username]["pin"]:
            print("Login successful.\n")
            return username
        else:
            print("Incorrect PIN.")

    print("Too many failed attempts.\n")
    return None


def delete_account(user_data, username):
    # Deletes the logged-in user's account after confirmation.
    confirm = input("Type 'DELETE' to confirm account deletion: ")
    if confirm == "DELETE":
        del user_data[username]
        print("Account deleted.\n")
        return True
    print("Deletion canceled.\n")
    return False


def change_pin(user_data, username):
    # Changes the user's PIN after verifying the old one.
    current = input("Enter current PIN: ").strip()
    if current != user_data[username]["pin"]:
        print("Incorrect current PIN.\n")
        return

    while True:
        new_pin = input("Enter new 4-digit PIN: ").strip()
        if len(new_pin) == 4 and new_pin.isdigit():
            user_data[username]["pin"] = new_pin
            print("PIN updated.\n")
            return
        print("Invalid PIN.\n")
