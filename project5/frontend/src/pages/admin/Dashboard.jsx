import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Ticket, Users, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await API.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center glass-panel rounded-3xl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const chartColors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Overview & Analytics</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time breakdown of events, ticket reservations, and user engagement</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Events</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.totalEvents || 0}</p>
          <p className="text-[11px] text-indigo-400 font-medium">{stats?.upcomingEvents || 0} upcoming</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.totalBookings || 0}</p>
          <p className="text-[11px] text-purple-400 font-medium">Active reservations</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">${stats?.totalRevenue || 0}</p>
          <p className="text-[11px] text-emerald-400/80 font-medium">Approved sales</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.totalUsers || 0}</p>
          <p className="text-[11px] text-blue-400 font-medium">Platform members</p>
        </div>
      </div>

      {/* Analytics Graph Section */}
      {stats?.categoryStats && stats.categoryStats.length > 0 && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Bookings Demand by Category</h3>
              <p className="text-xs text-slate-400">Total tickets booked per category</p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="bookingCount" radius={[8, 8, 0, 0]}>
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Bookings Activity Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Recent Booking Activity</h3>
        
        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {stats.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-indigo-400">{b.bookingReference}</td>
                    <td className="p-3 font-semibold text-white">{b.user ? b.user.name : 'Guest'}</td>
                    <td className="p-3 text-slate-300 max-w-xs truncate">{b.event?.title}</td>
                    <td className="p-3 font-bold">{b.totalAmount === 0 ? 'Free' : `$${b.totalAmount}`}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No recent bookings recorded.</p>
        )}
      </div>
    </div>
  );
};
