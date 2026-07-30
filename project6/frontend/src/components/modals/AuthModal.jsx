import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const { login, register, loading, error, closeAuthModal } = useAuth();

  const handleClose = onClose || closeAuthModal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const res = await login(email, password);
      if (res?.success) handleClose();
    } else {
      const res = await register(name, email, password, role, phone);
      if (res?.success) handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              {isLogin ? 'Welcome Back' : 'Create HavenKey Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {isLogin ? 'Sign in to access saved properties & wishlist' : 'Join premier luxury real estate network'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Connor"
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-xl text-xs text-slate-200"
                >
                  <option value="user" className="bg-slate-900">Buyer / Renter</option>
                  <option value="agent" className="bg-slate-900">Agent / Property Owner</option>
                  <option value="admin" className="bg-slate-900">Portal Administrator</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 font-bold hover:underline"
            >
              {isLogin ? 'Register now' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
