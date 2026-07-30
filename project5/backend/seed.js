require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event_management');
    console.log('[Seed]: Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});
    await Booking.deleteMany({});

    console.log('[Seed]: Cleared existing collections.');

    // 1. Create Admin & Demo Users
    const adminUser = await User.create({
      name: 'Admin Manager',
      email: 'admin@eventhub.com',
      password: 'admin123', // Encrypted via pre-save hook
      role: 'admin',
      phone: '+1 555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    });

    const secondAdmin = await User.create({
      name: 'Jane Organizer',
      email: 'jane.admin@eventhub.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 555-0188',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    });

    const demoUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      phone: '+1 555-0144',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    });

    const aliceUser = await User.create({
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'user123',
      role: 'user',
      phone: '+1 555-0122',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    });

    const bobUser = await User.create({
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'user123',
      role: 'user',
      phone: '+1 555-0133',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    });

    console.log('[Seed]: Admin and Demo users created successfully.');
    console.log('   -> Admin 1: admin@eventhub.com / admin123');
    console.log('   -> Admin 2: jane.admin@eventhub.com / admin123');
    console.log('   -> User 1:  user@example.com / user123');
    console.log('   -> User 2:  alice@example.com / user123');
    console.log('   -> User 3:  bob@example.com / user123');

    // 2. Create Categories
    const categories = await Category.insertMany([
      { name: 'Technology & AI', description: 'Developer summits, AI conferences & tech expos', icon: 'Cpu' },
      { name: 'Music & Concerts', description: 'Live festivals, acoustic sets & orchestral galas', icon: 'Music' },
      { name: 'Workshops & Design', description: 'Hands-on bootcamps & masterclasses', icon: 'Wrench' },
      { name: 'Business & Leadership', description: 'Networking forums & startup pitching sessions', icon: 'Briefcase' },
      { name: 'Sports & Fitness', description: 'Marathons, yoga retreats & tournaments', icon: 'Activity' },
    ]);

    console.log('[Seed]: Categories created.');

    const catTech = categories[0]._id;
    const catMusic = categories[1]._id;
    const catWorkshop = categories[2]._id;
    const catBusiness = categories[3]._id;
    const catSports = categories[4]._id;

    // 3. Create Sample Events
    const events = await Event.insertMany([
      {
        title: 'Global Tech & AI Summit 2026',
        description: 'Join industry pioneers, LLM researchers, and senior architects for a 3-day deep dive into the next generation of artificial intelligence, cloud scale architecture, and autonomous agents.',
        category: catTech,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '09:00 AM PST',
        location: 'Silicon Valley Convention Center, CA',
        venueDetails: 'Main Auditorium, Hall A & B. Parking included.',
        price: 149,
        totalSeats: 250,
        availableSeats: 248,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
        organizer: 'TechSphere Global',
        status: 'upcoming',
        createdBy: adminUser._id,
      },
      {
        title: 'Neon Horizon Music Festival',
        description: 'An unforgettable night of indie electronic beats, visual synth lightshows, and world-class live acoustics under the open night sky.',
        category: catMusic,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '06:30 PM EST',
        location: 'Brooklyn Waterfront Park, New York',
        venueDetails: 'Outdoor Arena 3, Gate B Entry.',
        price: 85,
        totalSeats: 500,
        availableSeats: 495,
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
        organizer: 'BeatPulse Events',
        status: 'upcoming',
        createdBy: adminUser._id,
      },
      {
        title: 'Fullstack UI/UX Masterclass & Design Systems',
        description: 'Interactive workshop teaching micro-interactions, responsive design systems, accessibility guidelines, and modern prototyping tricks.',
        category: catWorkshop,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '10:00 AM UTC',
        location: 'Metropolitan Design Hub, Chicago',
        venueDetails: 'Lab 4B - Laptops & Software provided.',
        price: 0, // Free event
        totalSeats: 60,
        availableSeats: 58,
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000',
        organizer: 'CraftUI Academy',
        status: 'upcoming',
        createdBy: adminUser._id,
      },
      {
        title: 'Venture & Founder Networking Forum',
        description: 'Meet angel investors, serial entrepreneurs, and venture partners for pitch reviews, 1-on-1 breakout sessions, and keynotes.',
        category: catBusiness,
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        time: '02:00 PM CST',
        location: 'Grand Hyatt Financial Plaza, Austin, TX',
        venueDetails: 'Executive Ballroom, 5th Floor.',
        price: 199,
        totalSeats: 120,
        availableSeats: 120,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
        organizer: 'Austin Founders Club',
        status: 'upcoming',
        createdBy: adminUser._id,
      },
      {
        title: 'Sunrise City Marathon & Health Expo',
        description: '10K and Half-Marathon run through scenic coastal pathways followed by a community wellness expo with organic food & recovery stalls.',
        category: catSports,
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        time: '06:00 AM PST',
        location: 'Ocean Boulevard Bay, San Diego, CA',
        venueDetails: 'Starting line near Pier 7.',
        price: 35,
        totalSeats: 1000,
        availableSeats: 998,
        image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=1000',
        organizer: 'Pacific Runners Club',
        status: 'upcoming',
        createdBy: adminUser._id,
      },
    ]);

    console.log('[Seed]: Events created.');

    // 4. Create Initial Sample Bookings for Demo Users
    await Booking.create({
      bookingReference: 'EVT-7X92K4',
      user: demoUser._id,
      event: events[0]._id,
      ticketsCount: 2,
      totalAmount: 298,
      status: 'approved',
      attendeeDetails: [
        { name: 'John Doe', email: 'user@example.com', phone: '+1 555-0144' },
        { name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1 555-0145' },
      ],
      bookingDate: new Date(),
    });

    await Booking.create({
      bookingReference: 'EVT-A39B28',
      user: aliceUser._id,
      event: events[1]._id,
      ticketsCount: 1,
      totalAmount: 85,
      status: 'approved',
      attendeeDetails: [
        { name: 'Alice Smith', email: 'alice@example.com', phone: '+1 555-0122' },
      ],
      bookingDate: new Date(),
    });

    await Booking.create({
      bookingReference: 'EVT-B92842',
      user: bobUser._id,
      event: events[2]._id,
      ticketsCount: 1,
      totalAmount: 0,
      status: 'approved',
      attendeeDetails: [
        { name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 555-0133' },
      ],
      bookingDate: new Date(),
    });

    console.log('[Seed]: Sample bookings seeded.');
    console.log('✅ [Database Seeding Completed Successfully!]');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
