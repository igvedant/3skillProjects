import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';

const QUICK_PROMPTS = [
  'Is this property still available?',
  'Can I get floor plans and disclosures?',
  'What are the HOA rules & monthly fees?',
  'Is the price negotiable for all-cash buyers?'
];

const ContactModal = ({ property, onClose }) => {
  const { submitInquiry } = useProperties();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('Hi, I am interested in this listing and would like to learn more.');
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
      message,
      tourType: 'inquiry_only'
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Inquiry Sent Successfully!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Agent <span className="text-cyan-400 font-semibold">{property.agent?.name || 'Sarah Jenkins'}</span> has received your message and will reach out shortly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Direct Contact Owner / Agent
              </span>
              <h3 className="text-xl font-bold text-white font-display line-clamp-1">
                Inquire about {property.title}
              </h3>
            </div>

            {/* Quick Agent Card preview */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-5">
              <img
                src={property.agent?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                alt={property.agent?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/40"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">{property.agent?.name || 'Sarah Jenkins'}</span>
                <span className="text-[10px] text-slate-400">{property.agent?.company || 'HavenKey Premier Properties'}</span>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">Quick Message Prompts:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(prompt)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition-colors text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
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
                  placeholder="john@example.com"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Your Message</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send Message to Owner'}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
