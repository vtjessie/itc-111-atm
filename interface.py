# interface.py
# Displays menus and handles user interaction while logged in

from transactions import check_balance, deposit, withdraw, transaction_history
from accounts import change_pin, delete_account

def user_menu(user_data, username):
    # Displays user options after login and processes actions.
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
            check_balance(user_data, username)
        elif choice == "2":
            deposit(user_data, username)
        elif choice == "3":
            withdraw(user_data, username)
        elif choice == "4":
            transaction_history(user_data, username)
        elif choice == "5":
            change_pin(user_data, username)
        elif choice == "6":
            if delete_account(user_data, username):
                break
        elif choice == "7":
            print("Logging out...\n")
            break
        else:
            print("Invalid selection.\n")
