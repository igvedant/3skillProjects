# Project 5: MERN Event Management System

A full-stack Event Management Web Application built on the MERN stack (MongoDB, Express.js, React, Node.js) with JWT authentication and automated email notifications.

## 🌟 Features
- **User Authentication**: Secure Registration & Login using JWT and `bcryptjs`.
- **Event Discovery & RSVP**: Users can browse upcoming events, view details, and register/RSVP.
- **Event Creation**: Admin/Organizer capabilities to host and manage events.
- **Email Notifications**: Integration with Nodemailer for confirmation emails.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, BcryptJS, Nodemailer, Dotenv, CORS.
- **Frontend**: React, Vite, Tailwind CSS, React Router DOM.

## 📂 Project Structure
```text
project5/
├── backend/
│   ├── config/          # DB connection & server configuration
│   ├── controllers/     # Authentication & Event business logic
│   ├── middleware/      # Auth & JWT verification middleware
│   ├── models/          # User & Event Mongoose models
│   ├── routes/          # API route definitions (/api/auth, /api/events)
│   ├── utils/           # Nodemailer mailer utilities
│   ├── seed.js          # Database seeder script
│   ├── server.js        # Express server entry point
│   └── package.json
└── frontend/
    ├── src/             # React views, components, and services
    ├── package.json
    └── vite.config.js
```

## 🚀 How to Run

### 1. Backend Server
```bash
cd project5/backend
npm install
npm run seed  # Optional: Seed sample events & users
npm run dev   # Starts server on http://localhost:5000
```

### 2. Frontend Client
```bash
cd project5/frontend
npm install
npm run dev   # Starts React client on http://localhost:5173
```
