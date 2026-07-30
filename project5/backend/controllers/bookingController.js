const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendBookingConfirmationEmail, sendBookingRejectionEmail } = require('../utils/emailService');

// Helper to generate reference code
const generateBookingRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'EVT-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// @desc    Create a new booking (Auto-approved for instant ticket)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { eventId, ticketsCount = 1, attendeeDetails = [] } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status === 'cancelled' || event.status === 'completed') {
      return res.status(400).json({ message: `Cannot book an event that is ${event.status}` });
    }

    if (event.availableSeats < ticketsCount) {
      return res.status(400).json({
        message: `Only ${event.availableSeats} seat(s) available for this event`,
      });
    }

    // Atomic seat deduction
    event.availableSeats -= ticketsCount;
    await event.save();

    const bookingRef = generateBookingRef();
    const totalAmount = event.price * ticketsCount;

    const booking = new Booking({
      bookingReference: bookingRef,
      user: req.user._id,
      event: event._id,
      ticketsCount,
      totalAmount,
      status: 'approved', // Auto-approved for instant digital ticket
      attendeeDetails: attendeeDetails.length > 0 ? attendeeDetails : [{ name: req.user.name, email: req.user.email, phone: req.user.phone }],
    });

    const savedBooking = await booking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate('event');

    // Send confirmation email asynchronously via Nodemailer
    sendBookingConfirmationEmail(req.user.email, req.user.name, populatedBooking, event);

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'category', select: 'name icon' },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel user's own booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Restore available seats on event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.ticketsCount;
      if (event.availableSeats > event.totalSeats) {
        event.availableSeats = event.totalSeats;
      }
      await event.save();
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookingsAdmin = async (req, res) => {
  try {
    const { status, eventId } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (eventId) {
      query.event = eventId;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone avatar')
      .populate({
        path: 'event',
        populate: { path: 'category', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin Approve or Reject Booking (Triggers email)
// @route   PUT /api/bookings/admin/:id/status
// @access  Private/Admin
const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status, reason } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const previousStatus = booking.status;
    const event = booking.event;

    // Handle seat count adjustments when transitioning status
    if (previousStatus !== 'rejected' && status === 'rejected') {
      // Rejection: restore seats back to event pool
      if (event) {
        event.availableSeats += booking.ticketsCount;
        if (event.availableSeats > event.totalSeats) event.availableSeats = event.totalSeats;
        await event.save();
      }
    } else if (previousStatus === 'rejected' && status === 'approved') {
      // Re-approving a rejected booking: check and deduct seats
      if (event) {
        if (event.availableSeats < booking.ticketsCount) {
          return res.status(400).json({ message: 'Not enough seats available to re-approve this booking' });
        }
        event.availableSeats -= booking.ticketsCount;
        await event.save();
      }
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    // Trigger emails based on Admin action
    const userEmail = booking.user ? booking.user.email : booking.attendeeDetails[0]?.email;
    const userName = booking.user ? booking.user.name : booking.attendeeDetails[0]?.name || 'Guest User';

    if (status === 'approved' && userEmail) {
      sendBookingConfirmationEmail(userEmail, userName, booking, event);
    } else if (status === 'rejected' && userEmail) {
      sendBookingRejectionEmail(userEmail, userName, booking, event, reason);
    }

    res.json({ message: `Booking status updated to ${status}`, booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
};
