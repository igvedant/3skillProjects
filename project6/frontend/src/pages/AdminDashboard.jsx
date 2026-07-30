import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Check,
  X
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

const AdminDashboard = () => {
  const { properties, leads, deleteProperty, updateProperty, updateLeadStatus, deleteLead } = useProperties();
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'leads'
  const [searchTerm, setSearchTerm] = useState('');

  const totalValuation = properties.reduce((acc, p) => acc + (p.price || 0), 0);
  const activeCount = properties.filter((p) => p.specs?.status === 'active').length;
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  const filteredProperties = properties.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Desk</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Portal Overview & Management
          </h1>
        </div>

        <Link
          to="/admin/add-property"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Listings</span>
            <p className="text-2xl font-extrabold text-white font-display">{properties.length}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Properties</span>
            <p className="text-2xl font-extrabold text-white font-display">{activeCount}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inquiries & Leads</span>
            <p className="text-2xl font-extrabold text-white font-display">
              {leads.length}{' '}
              {newLeadsCount > 0 && <span className="text-xs text-amber-400">({newLeadsCount} New)</span>}
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Portfolio Volume</span>
            <p className="text-xl font-extrabold text-cyan-400 font-display">{formatPrice(totalValuation)}</p>
          </div>
        </div>
      </div>

      {/* Main Datatable Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        {/* Table Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'properties'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Property Listings ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'leads'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Inquiries Inbox ({leads.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs text-white"
            />
          </div>
        </div>

        {/* Tab 1: Properties Table */}
        {activeTab === 'properties' && (
          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredProperties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={prop.images?.[0]}
                        alt={prop.title}
                        className="w-12 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-bold text-white block">{prop.title}</span>
                        <span className="text-[10px] text-slate-400">{prop.specs?.bedrooms} Beds • {prop.specs?.sqft} sqft</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{prop.location?.city}</td>
                    <td className="py-3.5 px-4 font-bold text-cyan-400">{formatPrice(prop.price)}</td>
                    <td className="py-3.5 px-4 capitalize">{prop.propertyType}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => updateProperty(prop._id, { featured: !prop.featured })}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          prop.featured ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-900 text-slate-500'
                        }`}
                      >
                        {prop.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/edit-property/${prop._id}`}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this property listing?')) deleteProperty(prop._id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Leads Inbox Table */}
        {activeTab === 'leads' && (
          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Tour / Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{lead.name}</span>
                      <span className="text-[10px] text-slate-400">{lead.email} • {lead.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-cyan-400 max-w-xs truncate">
                      {lead.propertyTitle || 'Property Listing'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-1">{lead.message}</p>
                      {lead.tourDate && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          Tour: {lead.tourDate} @ {lead.tourTime}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                        className="glass-input px-2 py-1 rounded-lg text-[11px] font-bold text-slate-200"
                      >
                        <option value="new" className="bg-slate-900">New</option>
                        <option value="contacted" className="bg-slate-900">Contacted</option>
                        <option value="scheduled" className="bg-slate-900">Tour Scheduled</option>
                        <option value="closed" className="bg-slate-900">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteLead(lead._id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
