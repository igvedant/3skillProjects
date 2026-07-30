import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Bed,
  Bath,
  Maximize,
  MapPin,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const PropertyCard = ({ property, viewMode = 'grid' }) => {
  const { toggleFavorite, isFavorite, toggleCompare, isCompared } = useFavorites();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'];

  const favorited = isFavorite(property._id);
  const compared = isCompared(property._id);

  const formatPrice = (price, type) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
    } else {
      toggleFavorite(property._id);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (viewMode === 'list') {
    return (
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 flex flex-col md:flex-row group">
        {/* Image Container */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={images[currentImgIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                property.listingType === 'rent' ? 'bg-cyan-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
            </span>
            {property.featured && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prevImage}
                className="p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:w-3/5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  {property.propertyType}
                </span>
                <h3
                  onClick={() => navigate(`/properties/${property._id}`)}
                  className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {property.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCompare(property._id)}
                  title="Compare property"
                  className={`p-2 rounded-xl text-xs border transition-all ${
                    compared
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-xl border transition-all ${
                    favorited
                      ? 'bg-rose-500/20 text-rose-500 border-rose-500/50'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {property.location?.address}, {property.location?.city}, {property.location?.state}
            </p>

            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {property.description}
            </p>

            {/* Specs row */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-800/80 mb-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-cyan-400" />
                <span>{property.specs?.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-cyan-400" />
                <span>{property.specs?.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-cyan-400" />
                <span>{property.specs?.sqft?.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-slate-400">Price</span>
              <p className="text-2xl font-extrabold text-white font-display">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>
            <Link
              to={`/properties/${property._id}`}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View Card
  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between">
      <div>
        {/* Top Image Slider */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={images[currentImgIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            <span
              className={`px-3 py-1 text-[11px] font-extrabold rounded-lg uppercase tracking-wider ${
                property.listingType === 'rent'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-emerald-400 text-slate-950'
              }`}
            >
              For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
            </span>
            {property.featured && (
              <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-amber-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          {/* Action buttons (Compare & Favorite) */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={() => toggleCompare(property._id)}
              title="Compare Property"
              className={`p-2 rounded-xl text-xs border backdrop-blur-md transition-all ${
                compared
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-950/60 text-slate-300 border-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={handleFavoriteClick}
              title="Save to Favorites"
              className={`p-2 rounded-xl text-xs border backdrop-blur-md transition-all ${
                favorited
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-slate-950/60 text-slate-300 border-white/10 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Price overlay badge */}
          <div className="absolute bottom-3 left-3">
            <p className="text-xl font-extrabold text-white drop-shadow-md font-display">
              {formatPrice(property.price, property.listingType)}
            </p>
          </div>

          {/* Slider navigation */}
          {images.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prevImage}
                className="p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase font-bold text-cyan-400 tracking-wider">
              {property.propertyType}
            </span>
            {property.verified && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified MLS
              </span>
            )}
          </div>

          <Link to={`/properties/${property._id}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 flex items-center gap-1 mb-4 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            {property.location?.address}, {property.location?.city}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-cyan-400" />
              <span>{property.specs?.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-cyan-400" />
              <span>{property.specs?.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-cyan-400" />
              <span>{property.specs?.sqft?.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="px-5 pb-5 pt-0">
        <Link
          to={`/properties/${property._id}`}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700/50"
        >
          <span>View Listing & Tour</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
