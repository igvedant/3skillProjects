import React from 'react';
import { Heart, Layers, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/property/PropertyCard';

const FavoritesPage = () => {
  const { favorites, compareItems, setIsCompareOpen } = useFavorites();
  const { properties } = useProperties();
  const { user, openAuthModal } = useAuth();

  const favoriteProperties = properties.filter((p) => favorites.includes(p._id));

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/30 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display mb-2">
            Sign In Required
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Please log in or create an account to view and manage your saved wishlist properties.
          </p>
          <button
            onClick={openAuthModal}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all inline-flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Sign In to View Saved Wishlist</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-1">
            Personal Saved Wishlist
          </span>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Saved Properties ({favoriteProperties.length})
          </h1>
        </div>

        {compareItems.length > 0 && (
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <Layers className="w-4 h-4" />
            <span>Launch Comparison ({compareItems.length})</span>
          </button>
        )}
      </div>

      {favoriteProperties.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-slate-800 my-8">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Your Saved Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Click the heart icon on any property card to save homes to your personal collection.
          </p>
          <Link
            to="/listings"
            className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-block"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property._id} property={property} viewMode="grid" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
