# Project 4: Full-Stack Quiz Application

A full-stack web application designed for interactive quizzes, featuring a RESTful Node.js/Express backend connected to a MongoDB database, coupled with a React frontend.

## 🌟 Overview
Users can attempt interactive multiple-choice quizzes, submit their answers for instant automated grading, and view detailed scores.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, React Router DOM v7.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, CORS, Dotenv.

## 📂 Project Structure
```text
project4/
├── backend/
│   ├── data/            # Question seed data
│   ├── models/          # Mongoose database schemas (Quiz, Question)
│   ├── routes/          # Express API endpoints
│   ├── db.js            # MongoDB connection logic
│   ├── server.js        # Server setup
│   └── package.json
├── frontend/
│   ├── src/             # React components, pages, & styling
│   ├── package.json
│   └── vite.config.js
└── verify.js            # Verification / test script
```

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd project4/backend
npm install
# Configure MongoDB connection in .env
npm run dev
```

### 2. Frontend Setup
```bash
cd project4/frontend
npm install
npm run dev
```
Access the application at [http://localhost:5173](http://localhost:5173).
