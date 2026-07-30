import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import MortgageCalculator from '../components/property/MortgageCalculator';
import PriceHistoryChart from '../components/property/PriceHistoryChart';
import ContactModal from '../components/modals/ContactModal';
import ScheduleTourModal from '../components/modals/ScheduleTourModal';
import LightboxModal from '../components/modals/LightboxModal';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { properties } = useProperties();
  const { toggleFavorite, isFavorite, toggleCompare, isCompared } = useFavorites();
  const { user, openAuthModal } = useAuth();

  const property = properties.find((p) => p._id === id) || properties[0];

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Property Not Found</h2>
        <Link to="/listings" className="text-cyan-400 font-bold underline mt-4 inline-block">
          Return to Listings
        </Link>
      </div>
    );
  }

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

  const handleFavoriteClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      toggleFavorite(property._id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/listings" className="hover:text-cyan-400">Listings</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-bold truncate">{property.title}</span>
      </div>

      {/* Hero Photo Gallery Grid */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
        <div
          onClick={() => {
            setLightboxIndex(0);
            setIsLightboxOpen(true);
          }}
          className="md:col-span-2 h-96 md:h-[450px] relative rounded-2xl overflow-hidden cursor-pointer group"
        >
          <img
            src={images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <button className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-slate-950/80 text-white text-xs font-bold flex items-center gap-2 border border-slate-700">
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span>View Photo Gallery</span>
          </button>
        </div>

        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
          {images.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx + 1);
                setIsLightboxOpen(true);
              }}
              className="h-[220px] rounded-2xl overflow-hidden cursor-pointer relative group"
            >
              <img
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2-Cols: Property Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-lg bg-cyan-500 text-slate-950">
                  For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
                </span>
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                  {property.propertyType}
                </span>
                {property.verified && (
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified MLS
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-2">
                {property.title}
              </h1>

              <p className="text-sm text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.zip}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 uppercase tracking-widest block">Listing Price</span>
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-display">
                {formatPrice(property.price, property.listingType)}
              </p>
              <div className="flex items-center gap-2 justify-start sm:justify-end mt-3">
                <button
                  onClick={() => toggleCompare(property._id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    compared
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{compared ? 'Compared' : 'Compare'}</span>
                </button>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    favorited
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
                  <span>{favorited ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Bedrooms</span>
                <p className="text-sm font-bold text-white">{property.specs?.bedrooms} Beds</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Bathrooms</span>
                <p className="text-sm font-bold text-white">{property.specs?.bathrooms} Baths</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                <Maximize className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Living Area</span>
                <p className="text-sm font-bold text-white">{property.specs?.sqft?.toLocaleString()} sqft</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Year Built</span>
                <p className="text-sm font-bold text-white">{property.specs?.yearBuilt || 2023}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white font-display">About This Property</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
            <h3 className="text-xl font-bold text-white font-display mb-6">Property Amenities & Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities?.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recharts Price Growth Chart */}
          <PriceHistoryChart priceHistory={property.priceHistory} />

          {/* Interactive Mortgage Calculator */}
          <MortgageCalculator defaultPrice={property.price} />
        </div>

        {/* Right 1-Col: Sticky Agent & Tour Action Card */}
        <div className="space-y-6">
          <div className="sticky top-28 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <img
                src={property.agent?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                alt={property.agent?.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-500/50"
              />
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                  Listing Agent
                </span>
                <h4 className="text-lg font-bold text-white font-display">
                  {property.agent?.name || 'Sarah Jenkins'}
                </h4>
                <p className="text-xs text-slate-400">{property.agent?.company || 'HavenKey Luxury'}</p>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule a Private Tour</span>
              </button>

              <button
                onClick={() => setIsContactOpen(true)}
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact Owner / Agent</span>
              </button>
            </div>

            {/* Direct Phone */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Direct Agent Line:</span>
              <a href={`tel:${property.agent?.phone}`} className="font-bold text-cyan-400 hover:underline">
                {property.agent?.phone || '+91 98200 12345'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isContactOpen && <ContactModal property={property} onClose={() => setIsContactOpen(false)} />}
      {isScheduleOpen && <ScheduleTourModal property={property} onClose={() => setIsScheduleOpen(false)} />}
      {isLightboxOpen && (
        <LightboxModal
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetailsPage;
