# transactions.py
# Handles balance checking, deposits, withdrawals, and viewing transaction history

from helpers import now_ts, safe_float_input, ensure_today_withdrawal_reset
from config import DAILY_WITHDRAWAL_LIMIT

def check_balance(user_data, username):
    # Displays the user's current balance.
    print(f"Balance: ${user_data[username]['balance']:.2f}\n")

def deposit(user_data, username):
    # Deposits a valid amount into user's account.
    amount = safe_float_input("Enter amount to deposit: $")
    if amount is None or amount <= 0:
        print("Invalid amount.\n")
        return

    user_data[username]["balance"] += round(amount, 2)
    user_data[username]["transactions"].append({
        "type": "deposit",
        "amount": amount,
        "timestamp": now_ts()
    })
    print(f"Deposited ${amount:.2f}.\n")

def withdraw(user_data, username):
    # Withdraws amount if within balance and daily limit.
    ensure_today_withdrawal_reset(user_data, username)

    amount = safe_float_input("Enter amount to withdraw: $")
    if amount is None or amount <= 0:
        print("Invalid amount.\n")
        return

    balance = user_data[username]["balance"]
    withdrawn_today = user_data[username]["withdrawn_today"]

    if amount > balance:
        print("Insufficient funds.\n")
    elif withdrawn_today + amount > DAILY_WITHDRAWAL_LIMIT:
        print(f"Daily limit exceeded. You can withdraw up to ${DAILY_WITHDRAWAL_LIMIT - withdrawn_today:.2f} more today.\n")
    else:
        user_data[username]["balance"] -= round(amount, 2)
        user_data[username]["withdrawn_today"] += round(amount, 2)
        user_data[username]["transactions"].append({
            "type": "withdraw",
            "amount": amount,
            "timestamp": now_ts()
        })
        print(f"Withdrawn ${amount:.2f}.\n")

def transaction_history(user_data, username):
    # Displays up to 10 of the user's most recent transactions.
    txs = user_data[username]["transactions"]
    if not txs:
        print("No transactions found.\n")
        return

    print("Recent Transactions:")
    for t in txs[-10:]:
        print(f" - [{t['timestamp']}] {t['type'].capitalize()}: ${t['amount']:.2f}")
    print()
