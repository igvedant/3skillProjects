import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { EventCard } from '../components/EventCard';
import { Search, Calendar, Sparkles, ShieldCheck, Ticket, Users, ArrowRight, Zap, Trophy, Cpu, Music, Wrench, Briefcase, Activity } from 'lucide-react';

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, catRes] = await Promise.all([
          API.get('/events?status=upcoming'),
          API.get('/categories'),
        ]);
        setEvents(eventsRes.data.slice(0, 6)); // Top 6 upcoming events
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/events');
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover & Book Premium Events Worldwide</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Connect to Extraordinary <br className="hidden sm:inline" />
            <span className="text-gradient">Tech, Music & Business Events</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Reserve your seats instantly for top developer summits, music concerts, interactive masterclasses, and executive pitch forums.
          </p>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 p-2 rounded-2xl glass-panel border border-slate-800 shadow-2xl">
            <div className="relative flex-1 flex items-center px-3">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Search event title, venue, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Metrics Badges */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl glass-panel border border-slate-800/80">
              <p className="text-2xl font-black text-white">500+</p>
              <p className="text-xs text-slate-400 mt-0.5">Events Hosted</p>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-slate-800/80">
              <p className="text-2xl font-black text-emerald-400">99.8%</p>
              <p className="text-xs text-slate-400 mt-0.5">Seat Confirmation</p>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-slate-800/80">
              <p className="text-2xl font-black text-indigo-400">25,000+</p>
              <p className="text-xs text-slate-400 mt-0.5">Registered Attendees</p>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-slate-800/80">
              <p className="text-2xl font-black text-purple-400">Instant</p>
              <p className="text-xs text-slate-400 mt-0.5">E-Ticket & QR Email</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
            <p className="text-xs text-slate-400">Explore events tailored to your technical and personal interests</p>
          </div>
          <Link to="/events" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/events?category=${cat._id}`}
              className="p-5 rounded-2xl glass-panel glass-panel-hover border border-slate-800 text-center flex flex-col items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300">{cat.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cat.description || 'Explore events'}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Upcoming Events</h2>
            <p className="text-xs text-slate-400">Reserve your spots before seats run out</p>
          </div>
          <Link to="/events" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>See full calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Upcoming Events Found</h3>
            <p className="text-xs text-slate-400 mt-1">Check back soon for new events.</p>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why EventHub?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Designed from the ground up for seamless attendee registration and comprehensive organizer management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant E-Ticket Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive instant confirmation with a unique reference code & digital ticket sent straight to your email.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Real-Time Seat Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atomic backend seat management ensures no overbooking and transparent real-time capacity progress.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Organizer Dashboard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-featured Admin Portal to manage event listings, oversee registration lists, and track analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
