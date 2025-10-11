# helpers.py
# General-purpose utility functions used throughout the ATM system

from datetime import datetime, date

def now_ts():
    # Returns the current timestamp as a string.
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def today_str():
    # Returns today's date in YYYY-MM-DD format.
    return date.today().isoformat()

def safe_float_input(prompt):
    # Safely converts user input to float, or returns None if invalid.
    try:
        return float(input(prompt))
    except ValueError:
        return None

def ensure_today_withdrawal_reset(user_data, username):
    # Resets user's daily withdrawal counter if the day has changed.
    if user_data[username]["withdraw_date"] != today_str():
        user_data[username]["withdrawn_today"] = 0
        user_data[username]["withdraw_date"] = today_str()
