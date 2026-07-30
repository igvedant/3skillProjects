import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Property description is required']
    },
    price: {
      type: Number,
      required: [true, 'Property price is required']
    },
    listingType: {
      type: String,
      enum: ['buy', 'rent'],
      default: 'buy',
      required: true
    },
    propertyType: {
      type: String,
      enum: ['villa', 'apartment', 'penthouse', 'house', 'condo', 'townhouse', 'commercial'],
      default: 'house',
      required: true
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'Maharashtra' },
      zip: { type: String, default: '400020' },
      lat: { type: Number, default: 18.944 },
      lng: { type: Number, default: 72.823 }
    },
    specs: {
      bedrooms: { type: Number, required: true, min: 0 },
      bathrooms: { type: Number, required: true, min: 0 },
      sqft: { type: Number, required: true },
      yearBuilt: { type: Number, default: 2022 },
      parkingSpaces: { type: Number, default: 2 },
      hoaFee: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['active', 'pending', 'sold'],
        default: 'active'
      }
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
      ]
    },
    featured: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: true
    },
    agent: {
      name: { type: String, default: 'Sarah Jenkins' },
      email: { type: String, default: 'sarah.j@havenkey.com' },
      phone: { type: String, default: '+1 (555) 234-5678' },
      avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
      },
      company: { type: String, default: 'HavenKey Premier Properties' }
    },
    priceHistory: [
      {
        year: Number,
        price: Number
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
