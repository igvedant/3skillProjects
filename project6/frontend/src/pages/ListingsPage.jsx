import React, { useState } from 'react';
import { LayoutGrid, List, MapPin, SlidersHorizontal, Building2 } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import PropertyFilterBar from '../components/property/PropertyFilterBar';
import PropertyCard from '../components/property/PropertyCard';
import PropertyMap from '../components/property/PropertyMap';

const ListingsPage = () => {
  const { filteredProperties, loading } = useProperties();
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            Real Estate Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Property Listings ({filteredProperties.length})
          </h1>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'map'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Split Map</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <PropertyFilterBar />

      {/* Results Rendering */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-300">Searching luxury properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 my-8">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">No Matching Properties Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria, price range sliders, or location filters.
          </p>
        </div>
      ) : viewMode === 'map' ? (
        <PropertyMap properties={filteredProperties} />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }
        >
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
