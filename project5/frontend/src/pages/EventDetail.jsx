import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Ticket, ShieldCheck, User, Users, CheckCircle, AlertCircle, ArrowLeft, Mail, Phone } from 'lucide-react';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [ticketsCount, setTicketsCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Primary attendee details form
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [attendeePhone, setAttendeePhone] = useState(user?.phone || '');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (user) {
      setAttendeeName(user.name);
      setAttendeeEmail(user.email);
      setAttendeePhone(user.phone || '');
    }
  }, [user]);

  const fetchEventDetails = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      console.error('Error fetching event detail:', err);
      setErrorMsg('Event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        eventId: event._id,
        ticketsCount: Number(ticketsCount),
        attendeeDetails: [
          {
            name: attendeeName,
            email: attendeeEmail,
            phone: attendeePhone,
          },
        ],
      };

      await API.post('/bookings', payload);
      setBookingModalOpen(false);
      navigate('/my-bookings?success=true');
    } catch (err) {
      console.error('Booking Error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to place booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (errorMsg && !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 glass-panel rounded-2xl border border-slate-800 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">{errorMsg}</h2>
          <Link to="/events" className="inline-flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Return to Events List
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link to="/events" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Explore Events
      </Link>

      {/* Main Banner Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800">
        <div className="h-72 sm:h-96 relative bg-slate-900">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 -mt-24 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {event.category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
                {event.category.name}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              event.price === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-indigo-600 text-white'
            }`}>
              {event.price === 0 ? 'FREE ENTRY' : `$${event.price} / TICKET`}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">About This Event</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.venueDetails && (
              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Venue & Access Notes</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{event.venueDetails}</p>
              </div>
            )}
          </div>

          {/* Organizer Info */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
              {event.organizer ? event.organizer.charAt(0) : 'E'}
            </div>
            <div>
              <p className="text-xs text-slate-400">Event Organizer</p>
              <h4 className="text-sm font-bold text-white">{event.organizer || 'EventHub Certified Host'}</h4>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Platform Organizer
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Reservation Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs text-slate-400">Ticket Price</p>
                <p className="text-2xl font-black text-white">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">Availability</p>
                <p className={`text-xs font-bold ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isSoldOut ? 'Sold Out' : `${event.availableSeats} seats left`}
                </p>
              </div>
            </div>

            {/* Seat Capacity Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${isSoldOut ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                  style={{
                    width: `${Math.min(100, ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                {event.totalSeats - event.availableSeats} of {event.totalSeats} seats claimed
              </p>
            </div>

            {/* Book Now Button Trigger */}
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                } else {
                  setBookingModalOpen(true);
                }
              }}
              disabled={isSoldOut}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                isSoldOut
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{isSoldOut ? 'Event Fully Booked' : user ? 'Register / Book Tickets' : 'Sign In to Book Ticket'}</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Instant digital ticket & email dispatch upon booking
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-400" /> Complete Registration
              </h3>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Number of Tickets</label>
                <select
                  value={ticketsCount}
                  onChange={(e) => setTicketsCount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {[...Array(Math.min(5, event.availableSeats)).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Ticket{i > 0 ? 's' : ''} ({event.price === 0 ? 'Free' : `$${(i + 1) * event.price}`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-200 text-xs">Primary Attendee Details</h4>
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Email Address (For E-Ticket Dispatch)</label>
                  <input
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex justify-between items-center text-sm">
                <span className="text-slate-300 font-semibold">Total Payable</span>
                <span className="text-lg font-black text-white">
                  {event.price === 0 ? 'FREE' : `$${ticketsCount * event.price}`}
                </span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm & Book Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
