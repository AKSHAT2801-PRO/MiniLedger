# 💰 MiniLedger

**MiniLedger** is a mobile application built to simplify loan management between friends and individuals. It helps users record loans, track outstanding amounts, monitor overdue payments, and manage repayments through a mobile-friendly interface.

The application uses **React Native with Expo** for the frontend, **Node.js with TypeScript** for the backend, and **PostgreSQL** for persistent data storage.

## ✨ Features

- 📝 Record loans between individuals.
- 👥 Retrieve loan records using phone numbers.
- 💸 Track loan amounts and outstanding balances.
- ✅ Mark loans as repaid.
- ⏳ Identify overdue loans and pending repayments.
- 📱 Cross-platform mobile application using React Native and Expo.
- 🔗 REST API communication between frontend and backend.
- 🗄️ Reliable relational data storage with PostgreSQL.

## 🛠️ Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React Native, Expo |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| API | REST API |
| Package Manager | npm |
| Development Tools | Git, GitHub, VS Code, Postman |

## 📁 Project Structure

```text
MiniLedger/
├── backend/
│   ├── controller/        # Handles API requests and responses
│   ├── repository/        # Database access and queries
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic
│   ├── dbconfig.ts        # PostgreSQL configuration
│   ├── index.ts           # Backend entry point
│   ├── package.json       # Backend dependencies and scripts
│   ├── package-lock.json
│   └── tsconfig.json      # TypeScript configuration
│
├── miniledger-app/
│   ├── app/               # Application screens and navigation
│   ├── assets/            # Images, icons, and static resources
│   ├── src/               # Reusable components and utilities
│   ├── .env               # Frontend environment variables
│   ├── .npmrc             # npm configuration
│   ├── app.json           # Expo configuration
│   ├── package.json       # Frontend dependencies and scripts
│   ├── package-lock.json
│   ├── tsconfig.json      # TypeScript configuration
│   └── README.md
│
├── .gitignore             # Git ignore rules
└── README.md              # Main project documentation
```

*Note: `node_modules/` and `.expo/` are generated locally and are omitted from this structure.*

## ⚙️ Prerequisites

Install the following before running the application:

- [Node.js](https://nodejs.org/) — LTS version recommended
- npm — Included with Node.js
- [PostgreSQL](https://www.postgresql.org/download/) — Database server
- [Git](https://git-scm.com/) — Version control
- [Expo Go](https://expo.dev/go) — To run the application on a physical mobile device

For emulator testing, install Android Studio and configure an Android Virtual Device.

## 🚀 Getting Started

Follow these steps to clone and run MiniLedger locally.

### Step 1: Clone the repository

```bash
git clone https://github.com/AKSHAT2801-PRO/MiniLedger.git
```

### Step 2: Navigate to the project directory

```bash
cd MiniLedger
```

### Step 3: Set up the backend

Navigate to the backend folder:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

### Step 4: Configure PostgreSQL

Ensure that PostgreSQL is installed and running.

Create a database for MiniLedger using PostgreSQL. For example:

```sql
CREATE DATABASE miniledger;
```

Configure the database connection in `backend/dbconfig.ts` or the environment variables expected by your backend.

For example, if your implementation uses a connection string, it may look like this:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/miniledger
```

Replace `USERNAME` and `PASSWORD` with your actual database credentials. The variable name must match what your code reads.

Make sure the required database tables are created using your existing schema or initialization scripts.

### Step 5: Start the backend server

From the `backend` directory, run:

```bash
npm start
```

Keep this terminal running while you use the application.

If the backend does not start, check the scripts in `backend/package.json` and follow the command configured for your project.

### Step 6: Set up the frontend

Open a **new terminal** and navigate to the frontend directory from the project root:

```bash
cd MiniLedger/miniledger-app
```

If the new terminal is already inside the `MiniLedger` folder, run:

```bash
cd miniledger-app
```

Install the frontend dependencies:

```bash
npm install
```

### Step 7: Configure the frontend API URL

Create or update `miniledger-app/.env` with the backend URL expected by your application.

For example:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8088
```

Replace `YOUR_LOCAL_IP` with the local IP address of the computer running the backend.

Choose the appropriate address for your environment:

- **Android emulator:** `http://10.0.2.2:8088`
- **Physical Android device:** `http://YOUR_LOCAL_IP:8088`
- **iOS simulator:** `http://localhost:8088` in a typical local setup

Ensure the frontend code uses the same environment variable name and that the backend is listening on the configured port.

For a physical device, connect both devices to the same Wi-Fi network and allow the backend to accept local network connections.

### Step 8: Start the React Native application

From the `miniledger-app` directory, run:

```bash
npx expo start -c
```

The `-c` option clears the Expo bundler cache.

Once Expo starts:

- Scan the QR code using Expo Go on your mobile device.
- Or launch the application in a configured emulator using the available terminal options.

## ⚡ Quick Start

### Terminal 1 — Backend

```bash
git clone https://github.com/AKSHAT2801-PRO/MiniLedger.git
cd MiniLedger
cd backend
npm install
npm start
```

### Terminal 2 — Frontend

Open a separate terminal:

```bash
cd MiniLedger/miniledger-app
npm install
npx expo start -c
```

**Before running:** Configure PostgreSQL, create the required tables, and set the correct backend URL in the frontend environment file.

## 🔌 Backend Architecture

The backend follows a modular structure to separate request handling, business logic, routing, and database operations.

- **Routes:** Define the API endpoints.
- **Controllers:** Handle incoming requests and return responses.
- **Services:** Implement application-specific business logic.
- **Repository:** Interact with the PostgreSQL database.
- **Database configuration:** Establishes the database connection.

This structure improves maintainability and keeps the application's responsibilities separated.

## 🗄️ Database

MiniLedger uses PostgreSQL as its relational database.

The database stores the information required to manage loans and their repayment status.

To configure the database:

1. Install and start PostgreSQL.
2. Create the `miniledger` database or use the database name configured in your backend.
3. Configure the connection details.
4. Initialize the required tables using your schema or migration scripts.
5. Start the backend and verify that the connection succeeds.

## 🐛 Troubleshooting

| Issue | Possible solution |
|---|---|
| `npm start` fails | Verify the scripts in `backend/package.json` and check the error output. |
| PostgreSQL connection fails | Check the database service, credentials, port, and database name. |
| Database tables are missing | Run the project's schema or initialization scripts. |
| Mobile app cannot reach the backend | Check the API URL, backend port, firewall, and network settings. |
| `localhost` does not work on a physical phone | Use the computer's LAN IP address. |
| Expo shows cached content | Run `npx expo start -c`. |
| Dependencies are missing | Run `npm install` in the relevant directory. |

## 🔒 Security

- Never commit database passwords or other secrets to GitHub.
- Keep `.env` files out of version control.
- Use `.gitignore` to exclude environment files and generated directories.
- Validate incoming API requests.
- Use appropriate authentication and authorization before production deployment.
- Restrict database access and use secure connection settings in production.

## 🔮 Future Enhancements

- User authentication and account management.
- Loan reminders and repayment notifications.
- Transaction history and repayment summaries.
- Search and filtering for loan records.
- Dashboard for lending and borrowing statistics.
- Deployment with a production database.

## 👨‍💻 Author

**Akshat Shukla**

GitHub: [AKSHAT2801-PRO](https://github.com/AKSHAT2801-PRO)

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute this project under an open-source license.
