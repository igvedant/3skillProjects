import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Home, CheckCircle } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';

const TIME_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];

const ScheduleTourModal = ({ property, onClose }) => {
  const { submitInquiry } = useProperties();
  const [tourType, setTourType] = useState('in_person');
  const [tourDate, setTourDate] = useState('2026-08-05');
  const [tourTime, setTourTime] = useState('02:00 PM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitInquiry({
      propertyId: property._id,
      propertyTitle: property.title,
      name,
      email,
      phone,
      message: `Scheduled ${tourType === 'in_person' ? 'In-Person' : '3D Video'} tour on ${tourDate} at ${tourTime}.`,
      tourType,
      tourDate,
      tourTime
    });
    setLoading(false);
    if (result?.success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Tour Booking Confirmed!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your {tourType === 'in_person' ? 'In-Person' : '3D Video'} tour for{' '}
              <span className="text-cyan-400 font-bold">{property.title}</span> has been requested for{' '}
              <span className="text-white font-semibold">{tourDate}</span> at{' '}
              <span className="text-white font-semibold">{tourTime}</span>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Private Viewing Request
              </span>
              <h3 className="text-xl font-bold text-white font-display line-clamp-1">
                Schedule a Tour for {property.title}
              </h3>
            </div>

            {/* Tour Type selector tabs */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setTourType('in_person')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  tourType === 'in_person'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>In-Person Tour</span>
              </button>
              <button
                type="button"
                onClick={() => setTourType('video_call')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  tourType === 'video_call'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>3D Live Video Tour</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date & Time Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Select Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Select Time</span>
                  </label>
                  <select
                    value={tourTime}
                    onChange={(e) => setTourTime(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-slate-200"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-slate-900">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* User details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jessica Taylor"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jessica@example.com"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
              >
                {loading ? 'Confirming Tour...' : 'Request Tour Reservation'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduleTourModal;
