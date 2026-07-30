import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Users, ArrowRight } from 'lucide-react';

export const EventCard = ({ event }) => {
  const isSoldOut = event.availableSeats <= 0;
  const isFree = event.price === 0;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80">
      {/* Image Banner Container */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        {event.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/75 backdrop-blur-md text-indigo-300 border border-indigo-500/30 shadow-lg">
            {event.category.name}
          </span>
        )}

        {/* Price Tag */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
          isFree 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md' 
            : 'bg-indigo-600 text-white'
        }`}>
          {isFree ? 'FREE' : `$${event.price}`}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Meta Specs */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{formatDate(event.date)} • {event.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate text-slate-400">{event.location}</span>
          </div>

          {/* Seat Capacity Progress */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                Seat Availability
              </span>
              <span className={`font-bold ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isSoldOut ? 'Sold Out' : `${event.availableSeats} / ${event.totalSeats} seats left`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isSoldOut ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                }`}
                style={{
                  width: `${Math.min(100, ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/events/${event._id}`}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            isSoldOut
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
          }`}
        >
          <span>{isSoldOut ? 'View Event Info' : 'Book Event Ticket'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
