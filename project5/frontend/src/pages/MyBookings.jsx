import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Ticket, Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, QrCode, ArrowRight, Ban } from 'lucide-react';

export const MyBookings = () => {
  const [searchParams] = useSearchParams();
  const showSuccessBanner = searchParams.get('success') === 'true';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Restored seats will be released back to the public pool.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      setMessage('Booking cancelled successfully.');
      fetchMyBookings();
      if (selectedTicket?._id === bookingId) {
        setSelectedTicket(null);
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmed / Ticket Active
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected by Host
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
            <Ban className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Ticket className="w-8 h-8 text-indigo-400" /> My Event Registrations
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Access your digital pass, view ticket QR details, or manage booking cancellations
        </p>
      </div>

      {/* Success Notification Banner */}
      {showSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">Booking Confirmed Successfully! 🎉</p>
              <p className="text-xs text-emerald-400/90 mt-0.5">
                A confirmation email with your digital ticket reference code has been sent to your inbox.
              </p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {message}
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl glass-panel animate-pulse bg-slate-900/60" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="glass-panel rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-700 transition-colors"
            >
              {/* Event Info */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(b.status)}
                  <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-500/30">
                    Ref: {b.bookingReference}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {b.event ? b.event.title : 'Event Information Unavailable'}
                </h3>

                {b.event && (
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {formatDate(b.event.date)} • {b.event.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {b.event.location}
                    </span>
                    <span className="font-semibold text-slate-200">
                      Tickets: {b.ticketsCount} ({b.totalAmount === 0 ? 'Free' : `$${b.totalAmount}`})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col items-center md:items-end gap-3 w-full md:w-auto">
                <button
                  onClick={() => setSelectedTicket(b)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" /> View Digital Ticket
                </button>

                {b.status === 'approved' && (
                  <button
                    onClick={() => handleCancelBooking(b._id)}
                    disabled={cancellingId === b._id}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    {cancellingId === b._id ? 'Cancelling...' : 'Cancel Registration'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Event Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't registered for any events yet. Explore upcoming summits and concerts to book your tickets!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30"
          >
            <span>Browse Events</span> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Digital Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Ticket Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 rounded-2xl text-white text-center space-y-1 relative">
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Official Event Ticket</span>
              <h3 className="text-lg font-black truncate pt-1">{selectedTicket.event?.title}</h3>
              <p className="text-xs opacity-90">{selectedTicket.event ? formatDate(selectedTicket.event.date) : ''} • {selectedTicket.event?.time}</p>
            </div>

            {/* Ticket Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Attendee Name</p>
                  <p className="font-bold text-white truncate mt-0.5">
                    {selectedTicket.attendeeDetails[0]?.name || 'Valued Guest'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Booking Reference</p>
                  <p className="font-mono font-bold text-indigo-400 mt-0.5">{selectedTicket.bookingReference}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Venue Location</p>
                  <p className="font-semibold text-slate-200 truncate mt-0.5">{selectedTicket.event?.location}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Tickets Count</p>
                  <p className="font-bold text-white mt-0.5">{selectedTicket.ticketsCount} Ticket(s)</p>
                </div>
              </div>

              {/* QR Code Graphic Placeholder */}
              <div className="p-6 rounded-2xl bg-white text-slate-900 text-center space-y-2">
                <div className="w-36 h-36 mx-auto border-4 border-slate-900 p-2 flex flex-col justify-between items-center rounded-xl bg-slate-50">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
                <p className="font-mono text-[11px] font-bold tracking-widest text-slate-700">{selectedTicket.bookingReference}</p>
                <p className="text-[10px] text-slate-500">Scan at entrance for instant event entry check-in</p>
              </div>

              <div className="text-center text-[11px] text-slate-400">
                Status: <strong className="text-emerald-400 uppercase">{selectedTicket.status}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
