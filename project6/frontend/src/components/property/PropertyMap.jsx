import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Eye, Heart, Bed, Bath, Maximize, ExternalLink } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

const PropertyMap = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(properties[0] || null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const formatPrice = (price, type) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  return (
    <div className="w-full h-[650px] rounded-3xl overflow-hidden glass-panel border border-slate-800 relative flex flex-col md:flex-row shadow-2xl">
      {/* Mock Map View background container */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden group">
        {/* Map grid overlay texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px), radial-gradient(#38bdf8 1px, #0f172a 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        {/* Map Top Header */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Interactive Map View - Top Prime Locations in India</span>
        </div>

        {/* Interactive Property Map Pins */}
        <div className="absolute inset-0 p-8 flex flex-wrap items-center justify-around gap-12">
          {properties.map((prop, idx) => {
            const isSelected = selectedProperty?._id === prop._id;
            return (
              <div
                key={prop._id}
                onClick={() => setSelectedProperty(prop)}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                  isSelected ? 'z-30 scale-110' : 'z-10'
                }`}
                style={{
                  transform: `translate(${(idx % 3) * 20 - 10}px, ${(idx % 2) * 30 - 15}px)`
                }}
              >
                {/* Pin Price Tag */}
                <div
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xl flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-white ring-4 ring-cyan-500/30'
                      : 'bg-slate-950/90 text-white border-slate-700 hover:border-cyan-400 hover:text-cyan-400'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{formatPrice(prop.price, prop.listingType)}</span>
                </div>

                {/* Pulse Glow when selected */}
                {isSelected && (
                  <div className="absolute -inset-1 rounded-xl bg-cyan-500/40 blur-md -z-10 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Property Sidebar Drawer on right */}
      {selectedProperty && (
        <div className="w-full md:w-96 bg-slate-950/95 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            {/* Image Header */}
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-slate-800">
              <img
                src={selectedProperty.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-cyan-500 text-slate-950">
                  {selectedProperty.propertyType}
                </span>
              </div>
              <button
                onClick={() => toggleFavorite(selectedProperty._id)}
                className={`absolute top-3 right-3 p-2 rounded-xl border backdrop-blur-md transition-all ${
                  isFavorite(selectedProperty._id)
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(selectedProperty._id) ? 'fill-white' : ''}`} />
              </button>
            </div>

            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Selected Listing
            </span>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
              {selectedProperty.title}
            </h3>

            <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {selectedProperty.location?.address}, {selectedProperty.location?.city}
            </p>

            <p className="text-2xl font-extrabold text-white font-display mb-4">
              {formatPrice(selectedProperty.price, selectedProperty.listingType)}
            </p>

            {/* Specs row */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-4">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-cyan-400" />
                <span>{selectedProperty.specs?.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-cyan-400" />
                <span>{selectedProperty.specs?.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-cyan-400" />
                <span>{selectedProperty.specs?.sqft} sqft</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
              {selectedProperty.description}
            </p>
          </div>

          <Link
            to={`/properties/${selectedProperty._id}`}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>View Full Details & Tour</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
