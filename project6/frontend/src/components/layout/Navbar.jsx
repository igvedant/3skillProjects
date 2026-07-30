import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Heart,
  Layers,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import AuthModal from '../modals/AuthModal';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const { favorites, compareItems, setIsCompareOpen } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSavedClick = (e) => {
    if (!user) {
      e.preventDefault();
      openAuthModal();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-1">
                  HAVEN<span className="text-cyan-400">KEY</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-cyan-400 font-semibold -mt-1">
                  Luxury Real Estate
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
              <Link
                to="/"
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Home
              </Link>
              <Link
                to="/listings"
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive('/listings')
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Properties
              </Link>
              <Link
                to="/favorites"
                onClick={handleSavedClick}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${
                  isActive('/favorites')
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>Saved</span>
                {user && favorites.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    isActive('/admin') || isActive('/admin/add-property') || isActive('/admin/leads')
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/25'
                      : 'text-amber-400 hover:bg-amber-400/10'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>

            {/* Quick Action Controls & User Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {compareItems.length > 0 && (
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 transition-all"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Compare ({compareItems.length})</span>
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 pl-3 rounded-full border border-slate-800">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/50"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-200 line-clamp-1">{user.name}</span>
                      <span className="text-[10px] text-cyan-400 capitalize font-medium">{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-slate-800 px-4 py-6 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/listings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
            >
              Properties
            </Link>
            <Link
              to="/favorites"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleSavedClick(e);
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
            >
              <span>Saved Properties</span>
              {user && favorites.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
              >
                Admin Dashboard
              </Link>
            )}

            <div className="pt-4 border-t border-slate-800">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-cyan-500 text-slate-950 font-bold"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
    </>
  );
};

export default Navbar;
