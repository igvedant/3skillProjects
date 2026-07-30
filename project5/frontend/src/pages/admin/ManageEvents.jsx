import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle, MapPin, Users } from 'lucide-react';

export const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [venueDetails, setVenueDetails] = useState('');
  const [price, setPrice] = useState(0);
  const [totalSeats, setTotalSeats] = useState(100);
  const [image, setImage] = useState('');
  const [organizer, setOrganizer] = useState('EventHub Global');
  const [status, setStatus] = useState('upcoming');

  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
      if (data.length > 0 && !category) setCategory(data[0]._id);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    if (categories.length > 0) setCategory(categories[0]._id);
    setDate('');
    setTime('09:00 AM');
    setLocation('');
    setVenueDetails('');
    setPrice(0);
    setTotalSeats(100);
    setImage('');
    setOrganizer('EventHub Global');
    setStatus('upcoming');
    setModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description);
    setCategory(evt.category?._id || (categories.length > 0 ? categories[0]._id : ''));
    setDate(evt.date ? evt.date.split('T')[0] : '');
    setTime(evt.time || '');
    setLocation(evt.location || '');
    setVenueDetails(evt.venueDetails || '');
    setPrice(evt.price || 0);
    setTotalSeats(evt.totalSeats || 100);
    setImage(evt.image || '');
    setOrganizer(evt.organizer || '');
    setStatus(evt.status || 'upcoming');
    setModalOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await API.delete(`/events/${id}`);
      setMsg({ type: 'success', text: 'Event deleted successfully' });
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete event' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        title,
        description,
        category,
        date,
        time,
        location,
        venueDetails,
        price: Number(price),
        totalSeats: Number(totalSeats),
        image,
        organizer,
        status,
      };

      if (editingEvent) {
        await API.put(`/events/${editingEvent._id}`, payload);
        setMsg({ type: 'success', text: 'Event updated successfully!' });
      } else {
        await API.post('/events', payload);
        setMsg({ type: 'success', text: 'Event created successfully!' });
      }

      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Event save error:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error saving event' });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Manage Events</h2>
          <p className="text-xs text-slate-400 mt-0.5">Add new events, update schedules, or adjust seat capacities</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Event
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

      {/* Search Input */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="h-48 glass-panel rounded-2xl animate-pulse" />
      ) : (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Event</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEvents.map((evt) => (
                <tr key={evt._id} className="hover:bg-slate-900/40">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={evt.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                      <div>
                        <p className="font-bold text-white max-w-xs truncate">{evt.title}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-400" /> {evt.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                      {evt.category?.name || 'General'}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(evt.date).toLocaleDateString()} • {evt.time}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-emerald-400">{evt.availableSeats}</span> / {evt.totalSeats}
                  </td>
                  <td className="p-3 font-bold">{evt.price === 0 ? 'Free' : `$${evt.price}`}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(evt)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt._id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingEvent ? 'Edit Event Details' : 'Create New Event'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI & Cloud Architecture Expo 2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organizer Name</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time (e.g. 09:00 AM PST)</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / City</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Silicon Valley Convention Center, CA"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($USD, 0 for Free)</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Seat Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Event Description</label>
                  <textarea
                    required
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of topics, speakers, and schedule..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  {formLoading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
