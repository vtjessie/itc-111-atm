# MCC Bank Portal

A simple **banking web application** built with a **React frontend** and a **Flask backend**.
The project demonstrates account management, transactions, and secure PIN handling using AES encryption.

---

## Folder Structure

```
.
├── frontend/                # React + Tailwind frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── venv/                    # Python virtual environment
├── app.py                   # Flask backend (main API)
├── accounts.py              # Account handling module
├── acct.py
├── ATM_Complete_Code.py
├── config.py
├── helpers.py
├── interface.py
├── main.py
├── transactions.py
└── package-lock.json
```

---

## Requirements

* **Python 3.10+**
* **Node.js 18+**
* **npm** (comes with Node)

---

## 1. Backend Setup (Flask)

### Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate     # macOS/Linux
# or
venv\Scripts\activate        # Windows
```

### Install dependencies

```bash
pip install flask flask-cors pycryptodome
```

### Run the Flask server

```bash
python app.py
```

Flask will start on **[http://localhost:5002](http://localhost:5002)**

---

## 2. Frontend Setup (React + Tailwind)

```bash
cd frontend
npm install
```

### Create `.env` file in `/frontend`:

```
REACT_APP_API_URL=http://localhost:5002
```

### Start the React development server

```bash
npm start
```

This runs the frontend on **[http://localhost:3000](http://localhost:3000)**

---

## 3. Connecting Frontend & Backend

* The frontend communicates with Flask via `fetch()` or `postData()` calls using the `REACT_APP_API_URL`.
* CORS is enabled in Flask (`CORS(app)`), so requests from port 3000 are allowed.
* Make sure **both servers** are running before testing.

---

## 4. Available Features

* **Create Account** — register a new user with encrypted PIN
* **Login** — verify credentials and access account
* **View Balance** — check current balance securely
* **Transaction** — deposit and withdraw funds
* **Change PIN** — update encrypted PIN securely
* **Delete Account** — remove user account with confirmation
* **Dark Theme UI** — built using TailwindCSS with icon-based navigation

---

## 5. API Test Examples

Run while Flask is active:

```bash
# Create account
curl -X POST http://localhost:5002/create-account \
  -H "Content-Type: application/json" \
  -d '{"username":"adam","pin":"1234","balance":1000}'
```

```bash
# Check balance
curl -X POST http://localhost:5002/balance \
  -H "Content-Type: application/json" \
  -d '{"username":"adam","pin":"1234"}'
```
