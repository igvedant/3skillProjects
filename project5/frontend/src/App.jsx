import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected User Pages
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ManageEvents } from './pages/admin/ManageEvents';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageBookings } from './pages/admin/ManageBookings';
import { ManageUsers } from './pages/admin/ManageUsers';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="events" element={<ManageEvents />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="bookings" element={<ManageBookings />} />
                  <Route path="users" element={<ManageUsers />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
