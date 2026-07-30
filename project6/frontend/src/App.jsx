import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboard from './pages/AdminDashboard';
import AddEditPropertyPage from './pages/AddEditPropertyPage';
import CompareModal from './components/modals/CompareModal';

const MainLayout = () => {
  const { isCompareOpen, setIsCompareOpen } = useFavorites();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-property" element={<AddEditPropertyPage />} />
          <Route path="/admin/edit-property/:id" element={<AddEditPropertyPage />} />
        </Routes>
      </main>
      <Footer />
      {isCompareOpen && <CompareModal onClose={() => setIsCompareOpen(false)} />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <FavoritesProvider>
          <Router>
            <MainLayout />
          </Router>
        </FavoritesProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
