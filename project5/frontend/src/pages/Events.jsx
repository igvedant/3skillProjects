import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { EventCard } from '../components/EventCard';
import { Search, Filter, Calendar, X, Tag, RefreshCw } from 'lucide-react';

export const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || 'all');
  const [dateFilter, setDateFilter] = useState(searchParams.get('dateFilter') || 'all');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, priceType, dateFilter]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (search.trim()) queryParams.push(`search=${encodeURIComponent(search.trim())}`);
      if (selectedCategory !== 'all') queryParams.push(`category=${selectedCategory}`);
      if (priceType !== 'all') queryParams.push(`priceType=${priceType}`);
      if (dateFilter !== 'all') queryParams.push(`dateFilter=${dateFilter}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const { data } = await API.get(`/events${queryString}`);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceType('all');
    setDateFilter('all');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore All Events</h1>
        <p className="text-sm text-slate-400 mt-1">
          Filter through conferences, summits, acoustic concerts, and masterclasses
        </p>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by event title, topic, or venue location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/90 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
          >
            Search
          </button>
        </form>

        {/* Category Pills & Dropdown Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              All Events
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat._id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Price Selector */}
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 text-slate-300 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Events</option>
              <option value="paid">Paid Events</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 text-slate-300 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Any Date</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl glass-panel animate-pulse bg-slate-900/60" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt._id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Events Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or category filters to find available events.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
