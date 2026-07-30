import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  Compass,
  CheckCircle2,
  Users,
  Home as HomeIcon,
  ChevronRight
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/property/PropertyCard';
import MortgageCalculator from '../components/property/MortgageCalculator';

const CATEGORIES = [
  {
    name: 'Luxury Villas',
    type: 'villa',
    count: '24+ Listed',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Skyline Penthouses',
    type: 'penthouse',
    count: '18+ Listed',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Modern Estates',
    type: 'house',
    count: '35+ Listed',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Coastal Apartments',
    type: 'apartment',
    count: '42+ Listed',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600'
  }
];

const Home = () => {
  const { properties, setFilters } = useProperties();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 3);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      listingType: activeTab,
      search: searchQuery,
      city: selectedCity
    }));
    navigate('/listings');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-10 px-4 sm:px-6 lg:px-8">
        {/* Background Ambient Image */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[3rem] border-b border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.35] scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Discover Architectural Masterpieces</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
            Find Your Sanctuary of <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Luxury & Prestige
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Access off-market villas, beachfront penthouses, and modern architectural estates with verified pricing and instant virtual tour scheduling.
          </p>

          {/* Smart Hero Search Bar */}
          <div className="glass-panel p-3 sm:p-4 rounded-3xl max-w-4xl mx-auto border border-slate-700/60 shadow-2xl">
            {/* Tabs (Buy / Rent) */}
            <div className="flex items-center gap-2 mb-4 w-max bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('buy')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'buy'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rent')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'rent'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rent Properties
              </button>
            </div>

            {/* Search inputs row */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Location Input */}
              <div className="md:col-span-5 relative text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-1">
                  Location or Keyword
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Mumbai, Gurgaon, Indiranagar, Goa..."
                    className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-semibold text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* City selector */}
              <div className="md:col-span-4 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full glass-input px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  <option value="All" className="bg-slate-900">All Cities</option>
                  <option value="Mumbai" className="bg-slate-900">Mumbai</option>
                  <option value="Gurgaon" className="bg-slate-900">Gurgaon</option>
                  <option value="Bengaluru" className="bg-slate-900">Bengaluru</option>
                  <option value="Goa" className="bg-slate-900">Goa</option>
                  <option value="Hyderabad" className="bg-slate-900">Hyderabad</option>
                  <option value="Pune" className="bg-slate-900">Pune</option>
                </select>
              </div>

              {/* Search button */}
              <div className="md:col-span-3 pt-5 md:pt-0">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Homes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Explore Collections
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display">
              Curated Property Types
            </h2>
          </div>
          <Link
            to="/listings"
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Browse All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.type}
              onClick={() => {
                setFilters((prev) => ({ ...prev, propertyType: cat.type }));
                navigate('/listings');
              }}
              className="relative h-64 rounded-3xl overflow-hidden glass-card cursor-pointer group border border-slate-800 hover:border-cyan-500/50 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
                  {cat.count}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors font-display">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROPERTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Luxury Selection</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white font-display">
              Featured Flagship Properties
            </h2>
          </div>
          <Link
            to="/listings"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 flex items-center gap-2 transition-all"
          >
            <span>View All Listings ({properties.length})</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} viewMode="grid" />
          ))}
        </div>
      </section>

      {/* MORTGAGE CALCULATOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MortgageCalculator defaultPrice={3200000} />
      </section>

      {/* WHY CHOOSE HAVENKEY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display mb-1">100% Verified MLS Listings</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every estate is verified for title clarity, square footage accuracy, and owner identity before publication.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display mb-1">3D Virtual Tours & Video Calls</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Experience walkthroughs from anywhere in the world with instant scheduled 3D live agent walk-throughs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display mb-1">Direct Owner Communication</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Skip middleman delays with direct owner messaging, lead tracking, and transparent price negotiations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
