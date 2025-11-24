# main.py
# Entry point of the ATM system

from config import MAX_PIN_ATTEMPTS
from accounts import create_account, login
from interface import user_menu

def main():
    # Runs the main ATM program loop.
    users = {}  # In-memory user database



    print("Welcome to the ATM System\n")
    str = "Welcome to the ATM System\n"
    while True:
        print("--- Main Menu ---")
        print("1. Login")
        print("2. Create Account")
        print("3. Exit")

        choice = input("Select an option (1-3): ").strip()

        if choice == "1":
            user = login(users, MAX_PIN_ATTEMPTS)
            if user:
                user_menu(users, user)
        elif choice == "2":
            create_account(users)
        elif choice == "3":
            print("Thank you for using the ATM. Goodbye!")
            break
        else:
            print("Invalid option.\n")

