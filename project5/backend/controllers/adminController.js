const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Category = require('../models/Category');

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalEvents = await Event.countDocuments({});
    const totalBookings = await Booking.countDocuments({});
    
    // Total Revenue calculation
    const approvedBookings = await Booking.find({ status: 'approved' });
    const totalRevenue = approvedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Bookings by category
    const categories = await Category.find({});
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const eventsInCat = await Event.find({ category: cat._id }).select('_id');
        const eventIds = eventsInCat.map(e => e._id);
        const bookingCount = await Booking.countDocuments({ event: { $in: eventIds } });
        return {
          name: cat.name,
          eventCount: eventsInCat.length,
          bookingCount: bookingCount,
        };
      })
    );

    // Recent 5 bookings
    const recentBookings = await Booking.find({})
      .populate('user', 'name email avatar')
      .populate('event', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming events count vs completed/ongoing
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue,
      upcomingEvents,
      ongoingEvents,
      categoryStats,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (user <-> admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent demoting the primary admin if trying to demote self
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own admin role' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
};
