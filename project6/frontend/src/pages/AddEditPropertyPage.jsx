import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Save, Sparkles, Building2, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

const AddEditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty } = useProperties();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    listingType: 'buy',
    propertyType: 'house',
    location: { address: '', city: 'Mumbai', state: 'Maharashtra', zip: '400020' },
    specs: { bedrooms: 3, bathrooms: 2.5, sqft: 2500, yearBuilt: 2023, parkingSpaces: 2, hoaFee: 1500 },
    amenities: ['Pool', 'Smart Home', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'],
    featured: false,
    verified: true
  });

  useEffect(() => {
    if (isEdit && id) {
      const existing = properties.find((p) => p._id === id);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id, isEdit, properties]);

  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      specs: {
        ...formData.specs,
        bedrooms: Number(formData.specs.bedrooms),
        bathrooms: Number(formData.specs.bathrooms),
        sqft: Number(formData.specs.sqft)
      }
    };

    if (isEdit) {
      await updateProperty(id, payload);
    } else {
      await addProperty(payload);
    }
    navigate('/admin');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Admin Wizard</span>
            <h1 className="text-2xl font-extrabold text-white font-display">
              {isEdit ? 'Edit Property Listing' : 'Publish New Property'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Information */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">1. Listing Overview & Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 mb-1 block">Property Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="The Glass Horizon Villa"
                className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500000"
                className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Listing Mode</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  className="w-full glass-input px-3 py-3 rounded-xl text-xs text-slate-200"
                >
                  <option value="buy" className="bg-slate-900">For Sale</option>
                  <option value="rent" className="bg-slate-900">For Rent</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Property Category</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full glass-input px-3 py-3 rounded-xl text-xs text-slate-200"
                >
                  <option value="villa" className="bg-slate-900">Villa</option>
                  <option value="house" className="bg-slate-900">Single House</option>
                  <option value="penthouse" className="bg-slate-900">Penthouse</option>
                  <option value="apartment" className="bg-slate-900">Apartment</option>
                  <option value="condo" className="bg-slate-900">Condo</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 mb-1 block">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Location */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">2. Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 mb-1 block">Street Address</label>
              <input
                type="text"
                required
                value={formData.location?.address}
                onChange={(e) =>
                  setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })
                }
                placeholder="124 Ocean View Promenade, Marine Drive"
                className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">City</label>
              <input
                type="text"
                required
                value={formData.location?.city}
                onChange={(e) =>
                  setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })
                }
                placeholder="Mumbai"
                className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">State / Zip</label>
              <input
                type="text"
                value={formData.location?.zip}
                onChange={(e) =>
                  setFormData({ ...formData, location: { ...formData.location, zip: e.target.value } })
                }
                placeholder="400020"
                className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Specifications */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">3. Property Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Bedrooms</label>
              <input
                type="number"
                value={formData.specs?.bedrooms}
                onChange={(e) =>
                  setFormData({ ...formData, specs: { ...formData.specs, bedrooms: e.target.value } })
                }
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Bathrooms</label>
              <input
                type="number"
                step="0.5"
                value={formData.specs?.bathrooms}
                onChange={(e) =>
                  setFormData({ ...formData, specs: { ...formData.specs, bathrooms: e.target.value } })
                }
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Living SqFt</label>
              <input
                type="number"
                value={formData.specs?.sqft}
                onChange={(e) =>
                  setFormData({ ...formData, specs: { ...formData.specs, sqft: e.target.value } })
                }
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Year Built</label>
              <input
                type="number"
                value={formData.specs?.yearBuilt}
                onChange={(e) =>
                  setFormData({ ...formData, specs: { ...formData.specs, yearBuilt: e.target.value } })
                }
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Images */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">4. High-Res Image URLs Manager</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste Image URL (Unsplash, Imgur, etc)..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 glass-input px-4 py-3 rounded-xl text-xs text-white"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold"
            >
              Add URL
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {formData.images?.map((img, idx) => (
              <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-slate-800">
                <img src={img} alt="Property" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rotate-90" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
        >
          <Save className="w-5 h-5" />
          <span>{isEdit ? 'Save Changes' : 'Publish Property Listing'}</span>
        </button>
      </form>
    </div>
  );
};

export default AddEditPropertyPage;
