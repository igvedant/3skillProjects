const Event = require('../models/Event');
const Category = require('../models/Category');

// @desc    Get all events with search, category, status & price filter
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, category, status, priceType, dateFilter } = req.query;

    let query = {};

    // Search term in title, description, or location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Status filter (default display all non-cancelled for regular users unless specified)
    if (status) {
      query.status = status;
    }

    // Price filter (free vs paid)
    if (priceType === 'free') {
      query.price = 0;
    } else if (priceType === 'paid') {
      query.price = { $gt: 0 };
    }

    // Date filter (upcoming / today / this_week)
    const now = new Date();
    if (dateFilter === 'today') {
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: now, $lte: endOfDay };
    } else if (dateFilter === 'upcoming') {
      query.date = { $gte: now };
    }

    const events = await Event.find(query)
      .populate('category', 'name icon')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('category', 'name icon description');
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      venueDetails,
      price,
      totalSeats,
      image,
      organizer,
      status,
    } = req.body;

    if (!title || !description || !category || !date || !time || !location || !totalSeats) {
      return res.status(400).json({ message: 'Please provide all required event details' });
    }

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      venueDetails: venueDetails || '',
      price: price || 0,
      totalSeats,
      availableSeats: totalSeats,
      image: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800',
      organizer: organizer || 'EventHub Global',
      status: status || 'upcoming',
      createdBy: req.user._id,
    });

    const createdEvent = await event.save();
    const populatedEvent = await Event.findById(createdEvent._id).populate('category', 'name icon');
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update existing event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      const seatDiff = req.body.totalSeats ? req.body.totalSeats - event.totalSeats : 0;
      
      event.title = req.body.title || event.title;
      event.description = req.body.description || event.description;
      event.category = req.body.category || event.category;
      event.date = req.body.date || event.date;
      event.time = req.body.time || event.time;
      event.location = req.body.location || event.location;
      event.venueDetails = req.body.venueDetails !== undefined ? req.body.venueDetails : event.venueDetails;
      event.price = req.body.price !== undefined ? req.body.price : event.price;
      
      if (req.body.totalSeats !== undefined) {
        event.totalSeats = req.body.totalSeats;
        event.availableSeats = Math.max(0, event.availableSeats + seatDiff);
      }

      if (req.body.image) event.image = req.body.image;
      if (req.body.organizer) event.organizer = req.body.organizer;
      if (req.body.status) event.status = req.body.status;

      const updatedEvent = await event.save();
      const populatedEvent = await Event.findById(updatedEvent._id).populate('category', 'name icon');
      res.json(populatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
