# ATM System 
# Features:
# - Multi-user login with PIN
# - Create account with initial balance
# - Deposit, Withdraw (with daily limit)
# - Transaction history
# - PIN change
# - Account deletion
# - All data is lost when program exits (in-memory only)


from datetime import datetime, date

# === CONFIGURATION ===
DAILY_WITHDRAWAL_LIMIT = 1000   # Max a user can withdraw per day
MAX_PIN_ATTEMPTS = 3            # How many times a user can try a PIN
# ======================

# In-memory user data (nothing is saved to disk)
users = {}


# === HELPER FUNCTIONS ===

def now_ts():
    # Returns current timestamp string.
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def today_str():
    # Returns today's date string.
    return date.today().isoformat()

def safe_float_input(prompt):
    # Attempts to return a float from input; returns None if invalid.
    try:
        return float(input(prompt))
    except ValueError:
        return None

def ensure_today_withdrawal_reset(user):
    # Resets daily withdrawal amount if the last date is not today.
    if users[user]["withdraw_date"] != today_str():
        users[user]["withdrawn_today"] = 0
        users[user]["withdraw_date"] = today_str()


# === ACCOUNT MANAGEMENT ===

def create_account():
    # Handles user account creation: username, PIN, initial balance.
    username = input("Create a username: ").strip()
    
    if username in users:
        print("Username already exists.\n")
        return

    # Ask for a valid 4-digit PIN
    while True:
        pin = input("Set a 4-digit PIN: ").strip()
        if len(pin) == 4 and pin.isdigit():
            break
        print("Invalid PIN. Must be 4 digits.")

    # Ask for a valid initial balance
    while True:
        balance = safe_float_input("Enter initial balance: $")
        if balance is not None and balance >= 0:
            break
        print("Invalid amount. Must be non-negative.")

    # Create user profile in memory
    users[username] = {
        "pin": pin,
        "balance": round(balance, 2),
        "transactions": [],
        "withdrawn_today": 0.0,
        "withdraw_date": today_str()
    }

    # Save initial deposit as transaction if balance > 0
    if balance > 0:
        users[username]["transactions"].append({
            "type": "initial deposit",
            "amount": balance,
            "timestamp": now_ts()
        })

    print(f"Account '{username}' created successfully.\n")


def login():
    """Authenticates a user by username and PIN."""
    username = input("Enter username: ").strip()

    if username not in users:
        print("User not found.\n")
        return None

    # Ask for PIN, allow up to MAX_PIN_ATTEMPTS
    for attempt in range(MAX_PIN_ATTEMPTS):
        pin = input("Enter PIN: ").strip()
        if pin == users[username]["pin"]:
            print("Login successful.\n")
            return username
        else:
            print("Incorrect PIN.")

    print("Too many failed attempts.\n")
    return None


def delete_account(username):
    # Deletes a user account after confirmation.
    confirm = input("Type 'DELETE' to confirm account deletion: ")
    if confirm == "DELETE":
        del users[username]
        print("Account deleted successfully.\n")
        return True
    else:
        print("Account deletion cancelled.\n")
        return False


# === TRANSACTIONS ===

def check_balance(username):
    # Displays the user's current balance.
    balance = users[username]["balance"]
    print(f"Your current balance is: ${balance:.2f}\n")


def deposit(username):
    # Handles depositing money into the user's account.
    amount = safe_float_input("Enter amount to deposit: $")
    if amount is None or amount <= 0:
        print("Invalid deposit amount.\n")
        return

    users[username]["balance"] += round(amount, 2)
    users[username]["transactions"].append({
        "type": "deposit",
        "amount": amount,
        "timestamp": now_ts()
    })

    print(f"Deposited ${amount:.2f} successfully.\n")


def withdraw(username):
    # Handles withdrawing money, respecting daily limits.
    ensure_today_withdrawal_reset(username)

    amount = safe_float_input("Enter amount to withdraw: $")
    if amount is None or amount <= 0:
        print("Invalid amount.\n")
        return

    balance = users[username]["balance"]
    withdrawn_today = users[username]["withdrawn_today"]

    if amount > balance:
        print("Insufficient funds.\n")
    elif withdrawn_today + amount > DAILY_WITHDRAWAL_LIMIT:
        remaining = DAILY_WITHDRAWAL_LIMIT - withdrawn_today
        print(f"Daily limit exceeded. You can withdraw up to ${remaining:.2f} today.\n")
    else:
        users[username]["balance"] -= round(amount, 2)
        users[username]["withdrawn_today"] += round(amount, 2)
        users[username]["transactions"].append({
            "type": "withdraw",
            "amount": amount,
            "timestamp": now_ts()
        })
        print(f"Withdrawn ${amount:.2f} successfully.\n")


def transaction_history(username):
    # Shows the user's last 10 transactions.
    txs = users[username]["transactions"]
    if not txs:
        print("No transactions yet.\n")
    else:
        print("\n--- Transaction History ---")
        for t in txs[-10:]:
            print(f"[{t['timestamp']}] {t['type'].capitalize()}: ${t['amount']:.2f}")
        print("")


def change_pin(username):
    # Allows user to change their PIN after verifying old PIN."""
    current_pin = input("Enter current PIN: ").strip()
    if current_pin != users[username]["pin"]:
        print("Incorrect current PIN.\n")
        return

    while True:
        new_pin = input("Enter new 4-digit PIN: ").strip()
        if len(new_pin) == 4 and new_pin.isdigit():
            users[username]["pin"] = new_pin
            print("PIN changed successfully.\n")
            return
        print("Invalid PIN. Must be 4 digits.\n")


# === LOGGED-IN USER MENU ===

def user_menu(username):
    # Displays and handles the logged-in user's options.
    while True:
        print("--- ATM Menu ---")
        print("1. Check Balance")
        print("2. Deposit")
        print("3. Withdraw")
        print("4. Transaction History")
        print("5. Change PIN")
        print("6. Delete Account")
        print("7. Logout")

        choice = input("Choose an option (1-7): ").strip()

        if choice == "1":
            check_balance(username)
        elif choice == "2":
            deposit(username)
        elif choice == "3":
            withdraw(username)
        elif choice == "4":
            transaction_history(username)
        elif choice == "5":
            change_pin(username)
        elif choice == "6":
            if delete_account(username):
                break  # Exit after deleting account
        elif choice == "7":
            print("Logging out...\n")
            break
        else:
            print("Invalid option.\n")


# === MAIN PROGRAM ===

def main():
    # Main program loop: login, create account, exit.
    print("Welcome to the ATM System\n")

    while True:
        print(" --- Main Menu ---")
        print("1. Login")
        print("2. Create Account")
        print("3. Exit")

        choice = input("Select an option (1-3): ").strip()

        if choice == "1":
            user = login()
            if user:
                user_menu(user)
        elif choice == "2":
            create_account()
        elif choice == "3":
            print("Thank you for using the ATM. Goodbye!")
            break
        else:
            print("Invalid option.\n")


# Start the ATM
if __name__ == "__main__":
    main()
