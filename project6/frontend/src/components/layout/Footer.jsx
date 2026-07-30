import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Send, Shield, Award, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                HAVEN<span className="text-cyan-400">KEY</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Premier real estate marketplace connecting buyers, renters, and property owners with luxury homes, architectural estates, and high-yield investments.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/30">
                <Award className="w-4 h-4" />
                <span>#1 Rated Portal 2026</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/30">
                <Shield className="w-4 h-4" />
                <span>Verified Listings</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/listings?listingType=buy" className="hover:text-cyan-400 transition-colors">
                  Homes for Sale
                </Link>
              </li>
              <li>
                <Link to="/listings?listingType=rent" className="hover:text-cyan-400 transition-colors">
                  Rental Properties
                </Link>
              </li>
              <li>
                <Link to="/listings?propertyType=villa" className="hover:text-cyan-400 transition-colors">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link to="/listings?propertyType=penthouse" className="hover:text-cyan-400 transition-colors">
                  Penthouses
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-cyan-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Top Locations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/listings?city=Mumbai" className="hover:text-cyan-400 transition-colors">
                  Mumbai (Marine Drive)
                </Link>
              </li>
              <li>
                <Link to="/listings?city=Gurgaon" className="hover:text-cyan-400 transition-colors">
                  Gurgaon (Golf Course Rd)
                </Link>
              </li>
              <li>
                <Link to="/listings?city=Bengaluru" className="hover:text-cyan-400 transition-colors">
                  Bengaluru (Indiranagar)
                </Link>
              </li>
              <li>
                <Link to="/listings?city=Goa" className="hover:text-cyan-400 transition-colors">
                  Goa (Anjuna Beach)
                </Link>
              </li>
              <li>
                <Link to="/listings?city=Hyderabad" className="hover:text-cyan-400 transition-colors">
                  Hyderabad (Jubilee Hills)
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Market Insights
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive off-market listings and weekly price trends.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to market insights!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 HavenKey Real Estate Portal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">MLS Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
