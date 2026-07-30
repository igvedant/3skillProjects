# Project 6: HavenKey Real Estate Portal

HavenKey is a luxury Real Estate Web Application engineered on the MERN stack featuring real-time property filtering, interactive market insights charts, lead management, user authentication, and tour scheduling.

## 🌟 Key Features
- **Property Listings & Search**: Interactive filtering by city (Mumbai, Gurgaon, Bengaluru, Goa, etc.), price range, and keyword search.
- **Detailed Property Views**: Image gallery lightbox, agent contact information, property specifications, and interactive Price History charts (`Recharts`).
- **Lead & Tour Management**: Interactive modals for direct agent contact (`ContactModal`) and tour scheduling (`ScheduleTourModal`) with Indian phone number formatting support (`+91`).
- **User Authentication**: Secure modal-based Registration & Login using JWT tokens.
- **Admin Dashboard**: Real-time management interface for reviewing property listings, leads, and inquiries.

## 🛠️ Tech Stack
- **Backend**: Express.js (ES Modules), MongoDB (Mongoose Atlas), JWT Authentication, `bcryptjs`.
- **Frontend**: React 18, Vite, React Router DOM v6, Tailwind CSS v4, Lucide React Icons, Recharts.

## 📂 Project Structure
```text
project6/
├── backend/
│   ├── config/          # Database configuration (`db.js`)
│   ├── controllers/     # Auth & Property controllers
│   ├── middleware/      # JWT verification middleware
│   ├── models/          # Mongoose models (`User`, `Property`, `Lead`)
│   ├── routes/          # API endpoints (`/api/auth`, `/api/properties`)
│   ├── seed.js          # Database seeding script
│   ├── server.js        # Express API Server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Nav, Footer, Modals (Auth, Contact, ScheduleTour)
    │   ├── context/     # AuthContext & PropertyContext
    │   ├── pages/       # Home, PropertyDetails, AdminDashboard, Listings
    │   └── data/        # Seed & fallback property datasets
    ├── package.json
    └── vite.config.js
```

## 🚀 Setup & Installation

### Backend Setup
```bash
cd project6/backend
npm install
npm run seed   # Populates database with premium property data
npm run dev    # Starts API on http://localhost:5000
```

### Frontend Setup
```bash
cd project6/frontend
npm install
npm run dev    # Starts client application on http://localhost:5173
```
