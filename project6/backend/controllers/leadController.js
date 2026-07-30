import Lead from '../models/Lead.js';
import Property from '../models/Property.js';

// @desc    Submit new lead inquiry or tour schedule request
// @route   POST /api/leads
export const createLead = async (req, res, next) => {
  try {
    const { propertyId, name, email, phone, message, tourType, tourDate, tourTime } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const lead = await Lead.create({
      property: propertyId,
      propertyTitle: property.title,
      user: req.user ? req.user._id : null,
      name,
      email,
      phone,
      message,
      tourType: tourType || 'inquiry_only',
      tourDate: tourDate || '',
      tourTime: tourTime || '',
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! An agent will contact you shortly.',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all lead inquiries (Admin/Agent)
// @route   GET /api/leads
export const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find()
      .populate('property', 'title price location images')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead inquiry status
// @route   PATCH /api/leads/:id/status
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.status = status || lead.status;
    await lead.save();

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};
