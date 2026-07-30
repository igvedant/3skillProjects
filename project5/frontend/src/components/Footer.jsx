import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span>Event<span className="text-indigo-400">Hub</span></span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your premier destination for discovering, booking, and hosting extraordinary events across technology, arts, music, and business.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-indigo-400 transition-colors">Explore All Events</Link></li>
              <li><Link to="/my-bookings" className="hover:text-indigo-400 transition-colors">My Bookings</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">User Profile</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Event Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/events?category=all" className="hover:text-indigo-400 transition-colors">Technology & AI</Link></li>
              <li><Link to="/events?category=all" className="hover:text-indigo-400 transition-colors">Music & Festivals</Link></li>
              <li><Link to="/events?category=all" className="hover:text-indigo-400 transition-colors">Design & Workshops</Link></li>
              <li><Link to="/events?category=all" className="hover:text-indigo-400 transition-colors">Business & Startup Forum</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support & Contact</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@eventhub.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>+1 (800) 555-EVENT</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 EventHub Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
