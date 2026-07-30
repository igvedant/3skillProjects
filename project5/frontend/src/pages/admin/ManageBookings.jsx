import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Ticket, CheckCircle, XCircle, Mail, AlertCircle, RefreshCw, User, Calendar } from 'lucide-react';

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Rejection modal
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Administrative capacity adjustment or schedule change.');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = filterStatus !== 'all' ? `/bookings/admin/all?status=${filterStatus}` : '/bookings/admin/all';
      const { data } = await API.get(url);
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    setUpdatingId(bookingId);
    setMsg({ type: '', text: '' });
    try {
      await API.put(`/bookings/admin/${bookingId}/status`, { status: 'approved' });
      setMsg({ type: 'success', text: 'Booking approved! Confirmation email dispatched to attendee.' });
      fetchBookings();
    } catch (err) {
      console.error('Approve Error:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to approve booking' });
    } finally {
      setUpdatingId(null);
    }
  };

  const openRejectionModal = (b) => {
    setSelectedBooking(b);
    setRejectionReason('Administrative capacity adjustment or schedule change.');
    setRejectionModalOpen(true);
  };

  const handleConfirmRejection = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setUpdatingId(selectedBooking._id);
    setMsg({ type: '', text: '' });

    try {
      await API.put(`/bookings/admin/${selectedBooking._id}/status`, {
        status: 'rejected',
        reason: rejectionReason,
      });
      setMsg({ type: 'success', text: 'Booking rejected. Apology email dispatched and event seats restored.' });
      setRejectionModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error('Rejection Error:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reject booking' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">All User Registrations</h2>
          <p className="text-xs text-slate-400 mt-0.5">Approve, reject, or manage attendee ticket records</p>
        </div>

        <button
          onClick={fetchBookings}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl glass-panel border border-slate-800 w-fit text-xs font-semibold">
        {['all', 'approved', 'rejected', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filterStatus === st
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="h-48 glass-panel rounded-2xl animate-pulse" />
      ) : (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">User & Contact</th>
                <th className="p-3">Event Title</th>
                <th className="p-3">Tickets</th>
                <th className="p-3">Total Paid</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Approve / Reject</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-mono font-bold text-indigo-400">{b.bookingReference}</td>
                  <td className="p-3">
                    <p className="font-bold text-white">{b.user?.name || b.attendeeDetails[0]?.name || 'Guest'}</p>
                    <p className="text-[11px] text-slate-400">{b.user?.email || b.attendeeDetails[0]?.email}</p>
                  </td>
                  <td className="p-3 max-w-xs truncate text-slate-200">{b.event?.title || 'Unknown Event'}</td>
                  <td className="p-3 font-semibold">{b.ticketsCount} Seat(s)</td>
                  <td className="p-3 font-bold">{b.totalAmount === 0 ? 'Free' : `$${b.totalAmount}`}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : b.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {b.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(b._id)}
                        disabled={updatingId === b._id}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {b.status !== 'rejected' && (
                      <button
                        onClick={() => openRejectionModal(b)}
                        disabled={updatingId === b._id}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-[11px] transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" /> Reject Booking & Dispatch Apology
              </h3>
              <button onClick={() => setRejectionModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Rejecting booking <strong>{selectedBooking.bookingReference}</strong> for{' '}
              <strong>{selectedBooking.event?.title}</strong> will restore {selectedBooking.ticketsCount} seat(s) to the event capacity.
            </p>

            <form onSubmit={handleConfirmRejection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Rejection (Included in Email)</label>
                <textarea
                  required
                  rows="3"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>Nodemailer email notification with apology notice will automatically send to attendee.</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingId === selectedBooking._id}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
                >
                  {updatingId === selectedBooking._id ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
