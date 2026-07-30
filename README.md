# 🚀 3Skill Projects Workspace

Welcome to the multi-project workspace repository containing full-stack web applications, interactive React apps, and custom frontend projects.

---

## 📋 Overview of Projects

| Project | Name & Description | Tech Stack | Type |
| :--- | :--- | :--- | :--- |
| [**Project 2**](./project2/README.md) | **Developer Portfolio Website**<br>Personal software engineering portfolio showcasing skills, experience, and projects with dynamic glassmorphism design. | HTML5, CSS3, Tailwind CSS (CDN), JavaScript (ES6+), FontAwesome | Frontend Static Web App |
| [**Project 3**](./project3/README.md) | **Emoji Memory Match Game**<br>Interactive memory card matching game featuring emoji cards, move counters, and victory detection. | React 19, Vite, Tailwind CSS 4, JavaScript | Single-Page Application |
| [**Project 4**](./project4/README.md) | **Full-Stack Quiz Application**<br>Full-stack quiz platform with automated scoring, question retrieval, and MongoDB database persistence. | React 19, Vite, Express.js, MongoDB (Mongoose), React Router DOM v7 | Full-Stack MERN App |
| [**Project 5**](./project5/README.md) | **MERN Event Management System**<br>Complete event management platform with user registration, JWT authentication, RSVP system, and Nodemailer email notifications. | React, Vite, Express.js, MongoDB, JWT, BcryptJS, Nodemailer | Full-Stack MERN App |
| [**Project 6**](./project6/README.md) | **HavenKey Real Estate Portal**<br>Luxury real estate portal with property search, price trend analytics, tour scheduling, lead management dashboard, and authentication. | React 18, Vite, Tailwind CSS v4, Express.js (ESM), MongoDB Atlas, Recharts | Full-Stack MERN App |

---

## 📁 Repository Structure

```text
3skillProjects/
├── .gitignore             # Workspace-level Git ignore configuration
├── README.md              # Combined master repository README
├── project2/              # Developer Portfolio Website
│   ├── index.html
│   ├── experience.html
│   ├── projects.html
│   ├── script.js
│   ├── styles.css
│   ├── .gitignore
│   └── README.md
├── project3/              # Emoji Memory Match Game
│   ├── src/
│   ├── package.json
│   ├── .gitignore
│   └── README.md
├── project4/              # Full-Stack Quiz Application
│   ├── backend/
│   ├── frontend/
│   ├── .gitignore
│   └── README.md
├── project5/              # MERN Event Management System
│   ├── backend/
│   ├── frontend/
│   ├── .gitignore
│   └── README.md
└── project6/              # HavenKey Real Estate Portal
    ├── backend/
    ├── frontend/
    ├── .gitignore
    └── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### Running any Full-Stack Project (Projects 4, 5, 6)

1. **Start the Backend:**
   ```bash
   cd projectX/backend   # Replace X with 4, 5, or 6
   npm install
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd projectX/frontend  # Replace X with 4, 5, or 6
   npm install
   npm run dev
   ```

### Running Frontend-only Projects (Projects 2, 3)

- **Project 2:** Open `project2/index.html` directly in your browser or run via Live Server.
- **Project 3:** Run `cd project3 && npm install && npm run dev`.

---

## 🔒 Environment Variables
For projects requiring backend database connection (Projects 4, 5, and 6), make sure to configure `.env` inside `projectX/backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🛠️ Global Git Configuration
All build artifacts (`dist/`, `build/`), dependency folders (`node_modules/`), log files (`*.log`), and secret files (`.env`) are configured in `.gitignore` across all project directories to keep the repository clean and secure.
