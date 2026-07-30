import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Tag, Ticket, Users, ArrowLeft, Shield } from 'lucide-react';

export const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard Stats', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/admin/events', label: 'Manage Events', icon: <Calendar className="w-4 h-4" /> },
    { path: '/admin/categories', label: 'Categories', icon: <Tag className="w-4 h-4" /> },
    { path: '/admin/bookings', label: 'All Bookings', icon: <Ticket className="w-4 h-4" /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 bg-indigo-950/20">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Organizer Admin Panel</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Platform administration, analytics & ticket approvals
            </p>
          </div>

          <div className="p-3 rounded-2xl glass-panel border border-slate-800 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="border-t border-slate-800 pt-2 mt-2">
              <Link
                to="/"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Site
              </Link>
            </div>
          </div>
        </div>

        {/* Main Admin Content Outlet */}
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
