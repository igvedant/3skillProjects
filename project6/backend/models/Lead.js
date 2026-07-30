import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    propertyTitle: {
      type: String,
      default: ''
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, 'Please provide your name']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number']
    },
    message: {
      type: String,
      required: [true, 'Please provide a message or notes']
    },
    tourType: {
      type: String,
      enum: ['in_person', 'video_call', 'inquiry_only'],
      default: 'inquiry_only'
    },
    tourDate: {
      type: String,
      default: ''
    },
    tourTime: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'scheduled', 'closed'],
      default: 'new'
    }
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
