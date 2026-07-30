import React from 'react';
import { X, Trash2, Layers, Check, Minus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useProperties } from '../../context/PropertyContext';

const CompareModal = ({ onClose }) => {
  const { compareItems, toggleCompare, clearCompare } = useFavorites();
  const { properties } = useProperties();

  const comparedProperties = properties.filter((p) => compareItems.includes(p._id));

  const formatPrice = (price, type) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Side-by-Side Property Comparison</h3>
              <p className="text-xs text-slate-400">Compare specs, pricing, and luxury features</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProperties.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matrix Body */}
        {comparedProperties.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No properties selected for comparison.</p>
            <p className="text-xs text-slate-500 mt-1">
              Click the compare icon on property cards to select up to 4 items.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto py-6">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase w-48 sticky left-0 bg-slate-950/90 backdrop-blur-md z-10">
                    Property Spec
                  </th>
                  {comparedProperties.map((prop) => (
                    <th key={prop._id} className="p-3 text-center min-w-[200px]">
                      <div className="relative rounded-xl overflow-hidden mb-2 h-28 border border-slate-800">
                        <img
                          src={prop.images?.[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleCompare(prop._id)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-white line-clamp-1 block">{prop.title}</span>
                      <span className="text-[10px] text-cyan-400 font-semibold">{prop.location?.city}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/60">
                <tr>
                  <td className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-950/90 z-10">
                    Price
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop._id} className="p-3 text-center font-bold text-cyan-400 text-sm">
                      {formatPrice(prop.price, prop.listingType)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-950/90 z-10">
                    Type
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop._id} className="p-3 text-center text-slate-200 capitalize">
                      {prop.propertyType}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-950/90 z-10">
                    Bedrooms / Baths
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop._id} className="p-3 text-center text-slate-200">
                      {prop.specs?.bedrooms} Beds / {prop.specs?.bathrooms} Baths
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-950/90 z-10">
                    Total SqFt
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop._id} className="p-3 text-center text-slate-200">
                      {prop.specs?.sqft?.toLocaleString()} sqft
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-950/90 z-10">
                    Price / SqFt
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop._id} className="p-3 text-center text-slate-200 font-semibold">
                      ₹{Math.round(prop.price / (prop.specs?.sqft || 1))} / sqft
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-950/90 z-10">
                    Year Built
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop._id} className="p-3 text-center text-slate-200">
                      {prop.specs?.yearBuilt || 2022}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-300 sticky left-0 bg-slate-950/90 z-10">
                    Action
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop._id} className="p-3 text-center">
                      <Link
                        to={`/properties/${prop._id}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[11px]"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareModal;
