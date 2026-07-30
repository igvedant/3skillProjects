export const initialProperties = [
  {
    _id: 'prop-1',
    title: 'The Glass Horizon Sea-Facing Villa',
    description: 'An architectural masterpiece overlooking the Arabian Sea featuring floor-to-ceiling glass walls, a private infinity pool, smart home automation, and panoramic sunset views.',
    price: 48500000,
    listingType: 'buy',
    propertyType: 'villa',
    location: {
      address: '124 Ocean View Promenade, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400020',
      lat: 18.944,
      lng: 72.823
    },
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      sqft: 6800,
      yearBuilt: 2023,
      parkingSpaces: 4,
      hoaFee: 15000,
      status: 'active'
    },
    amenities: ['Pool', 'Water View', 'Smart Home', 'Gym', 'Wine Cellar', 'Solar', 'Security System', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    verified: true,
    agent: {
      name: 'Priya Sharma',
      email: 'priya.s@havenkey.in',
      phone: '+91 98200 12345',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      company: 'HavenKey Luxury Estates India'
    },
    priceHistory: [
      { year: 2021, price: 42000000 },
      { year: 2022, price: 45000000 },
      { year: 2023, price: 47000000 },
      { year: 2024, price: 48500000 }
    ]
  },
  {
    _id: 'prop-2',
    title: 'Skyline Crown Duplex Penthouse',
    description: 'Ultra-luxurious duplex penthouse along Golf Course Road. Offers 360-degree skyline views, private elevator entrance, custom Italian kitchen, and rooftop terrace with Jacuzzi.',
    price: 32000000,
    listingType: 'buy',
    propertyType: 'penthouse',
    location: {
      address: 'DLF Crest, Golf Course Road',
      city: 'Gurgaon',
      state: 'Haryana',
      zip: '122002',
      lat: 28.459,
      lng: 77.09
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4.5,
      sqft: 4500,
      yearBuilt: 2022,
      parkingSpaces: 3,
      hoaFee: 12000,
      status: 'active'
    },
    amenities: ['Water View', 'Smart Home', 'Elevator', 'Gym', 'Concierge', 'Balcony', 'EV Charger'],
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    verified: true,
    agent: {
      name: 'Rohan Mehta',
      email: 'rohan.m@havenkey.in',
      phone: '+91 98110 54321',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      company: 'HavenKey Capital Estates'
    },
    priceHistory: [
      { year: 2021, price: 28000000 },
      { year: 2022, price: 30000000 },
      { year: 2023, price: 31500000 },
      { year: 2024, price: 32000000 }
    ]
  },
  {
    _id: 'prop-3',
    title: 'Minimalist Modern Garden Estate',
    description: 'Sleek contemporary design in posh Indiranagar. High timber ceilings, energy-efficient solar roof, lush private garden, heated outdoor patio, and gourmet chef kitchen.',
    price: 21500000,
    listingType: 'buy',
    propertyType: 'house',
    location: {
      address: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560038',
      lat: 12.978,
      lng: 77.64
    },
    specs: {
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 3400,
      yearBuilt: 2021,
      parkingSpaces: 2,
      hoaFee: 5000,
      status: 'active'
    },
    amenities: ['Solar', 'Smart Home', 'Garden', 'Fireplace', 'EV Charger', 'Security System'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false,
    verified: true,
    agent: {
      name: 'Ananya Reddy',
      email: 'ananya.r@havenkey.in',
      phone: '+91 99000 87654',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      company: 'HavenKey South Properties'
    },
    priceHistory: [
      { year: 2021, price: 19000000 },
      { year: 2022, price: 20500000 },
      { year: 2023, price: 21500000 }
    ]
  },
  {
    _id: 'prop-4',
    title: 'Sunset Waterfront Beach Villa',
    description: 'Exquisite coastal living with private swimming pool near Anjuna Beach. Features open concept living space, quartz kitchen island, floor-to-ceiling windows, and tropical garden.',
    price: 85000,
    listingType: 'rent',
    propertyType: 'villa',
    location: {
      address: 'Beach Road, Anjuna',
      city: 'Goa',
      state: 'Goa',
      zip: '403509',
      lat: 15.587,
      lng: 73.737
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2200,
      yearBuilt: 2023,
      parkingSpaces: 2,
      hoaFee: 0,
      status: 'active'
    },
    amenities: ['Water View', 'Pool', 'Gym', 'Balcony', 'Concierge', 'Elevator', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    verified: true,
    agent: {
      name: 'Priya Sharma',
      email: 'priya.s@havenkey.in',
      phone: '+91 98200 12345',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      company: 'HavenKey Luxury Estates India'
    },
    priceHistory: [
      { year: 2023, price: 80000 },
      { year: 2024, price: 85000 }
    ]
  },
  {
    _id: 'prop-5',
    title: 'The Grand Jubilee Royal Manor',
    description: 'Gated Jubilee Hills compound offering uncompromised privacy and grandeur. Tennis court, guest house, 8-car showroom garage, screening room, and resort swimming pool.',
    price: 79000000,
    listingType: 'buy',
    propertyType: 'villa',
    location: {
      address: 'Road No. 36, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '500033',
      lat: 17.432,
      lng: 78.407
    },
    specs: {
      bedrooms: 6,
      bathrooms: 8,
      sqft: 9200,
      yearBuilt: 2020,
      parkingSpaces: 8,
      hoaFee: 8000,
      status: 'active'
    },
    amenities: ['Pool', 'Gym', 'Wine Cellar', 'Smart Home', 'Security System', 'Garden', 'Fireplace', 'Solar'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    verified: true,
    agent: {
      name: 'Vikram Kapoor',
      email: 'vikram.k@havenkey.in',
      phone: '+91 97000 11223',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      company: 'HavenKey Premier Office'
    },
    priceHistory: [
      { year: 2021, price: 72000000 },
      { year: 2022, price: 75000000 },
      { year: 2023, price: 77500000 },
      { year: 2024, price: 79000000 }
    ]
  },
  {
    _id: 'prop-6',
    title: 'High-Rise Tech Loft',
    description: 'Contemporary loft styled for tech founders & executives in Koregaon Park. High-speed fiber internet, acoustic soundproofing, polished concrete floors, and rooftop lounge.',
    price: 52000,
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      address: 'Lane 7, Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      zip: '411001',
      lat: 18.536,
      lng: 73.893
    },
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1450,
      yearBuilt: 2022,
      parkingSpaces: 1,
      hoaFee: 0,
      status: 'active'
    },
    amenities: ['Water View', 'Smart Home', 'Gym', 'EV Charger', 'Elevator', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false,
    verified: true,
    agent: {
      name: 'Ananya Reddy',
      email: 'ananya.r@havenkey.in',
      phone: '+91 99000 87654',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      company: 'HavenKey Residential'
    },
    priceHistory: [
      { year: 2023, price: 49000 },
      { year: 2024, price: 52000 }
    ]
  }
];
