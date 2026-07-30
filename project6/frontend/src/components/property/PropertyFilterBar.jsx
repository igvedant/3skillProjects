import React, { useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  IndianRupee,
  Bed,
  Building,
  Check,
  ChevronDown
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';

const AMENITY_OPTIONS = [
  'Pool',
  'Water View',
  'Smart Home',
  'Gym',
  'Wine Cellar',
  'Solar',
  'Security System',
  'Balcony',
  'EV Charger',
  'Elevator'
];

const CITIES = ['All', 'Mumbai', 'Gurgaon', 'Bengaluru', 'Goa', 'Hyderabad', 'Pune'];

const PropertyFilterBar = () => {
  const { filters, setFilters, resetFilters } = useProperties();
  const [expanded, setExpanded] = useState(false);

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      const nextAmenities = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: nextAmenities };
    });
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 mb-8 border border-slate-800 shadow-xl">
      {/* Top Main Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search address, city, or property keyword..."
            className="w-full glass-input pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Quick listing type switcher */}
        <div className="flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-full lg:w-auto">
          {['all', 'buy', 'rent'].map((type) => (
            <button
              key={type}
              onClick={() => setFilters({ ...filters, listingType: type })}
              className={`flex-1 lg:flex-none px-5 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                filters.listingType === type
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Status' : type === 'buy' ? 'For Sale' : 'For Rent'}
            </button>
          ))}
        </div>

        {/* City Selector */}
        <div className="w-full lg:w-48">
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full glass-input px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-200 cursor-pointer focus:ring-2 focus:ring-cyan-500"
          >
            {CITIES.map((city) => (
              <option key={city} value={city} className="bg-slate-900 text-slate-200">
                {city === 'All' ? 'All Cities' : city}
              </option>
            ))}
          </select>
        </div>

        {/* Sort & Toggle More Filters */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`px-4 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              expanded || filters.amenities.length > 0 || filters.minPrice || filters.maxPrice
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {(filters.amenities.length > 0 || filters.minPrice || filters.maxPrice) && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>

          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="p-3.5 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900/60 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Filter Options Drawer */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />
              <span>Price Range (₹)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="glass-input px-3 py-2 rounded-xl text-xs text-white"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="glass-input px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>Property Type</span>
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-medium text-slate-200"
            >
              <option value="all" className="bg-slate-900">All Types</option>
              <option value="villa" className="bg-slate-900">Villa</option>
              <option value="apartment" className="bg-slate-900">Apartment</option>
              <option value="penthouse" className="bg-slate-900">Penthouse</option>
              <option value="house" className="bg-slate-900">Single House</option>
              <option value="condo" className="bg-slate-900">Condo</option>
            </select>
          </div>

          {/* Bedrooms Count */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-cyan-400" />
              <span>Min Bedrooms</span>
            </label>
            <div className="flex gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              {['any', '1', '2', '3', '4', '5'].map((num) => (
                <button
                  key={num}
                  onClick={() => setFilters({ ...filters, bedrooms: num })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filters.bedrooms === num
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {num === 'any' ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
              Sort Results By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-medium text-slate-200"
            >
              <option value="latest" className="bg-slate-900">Newest Listings</option>
              <option value="price_asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price_desc" className="bg-slate-900">Price: High to Low</option>
              <option value="sqft_desc" className="bg-slate-900">Largest SqFt</option>
            </select>
          </div>

          {/* Amenities Checklist */}
          <div className="lg:col-span-4 pt-4 border-t border-slate-800/60">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 block">
              Luxury Amenities Checklist
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const selected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      selected
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/60'
                        : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilterBar;
