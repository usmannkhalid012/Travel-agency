export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Search', path: '/search' }
];

export const dashboardLinks = {
  customer: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Bookings', path: '/dashboard/bookings' },
    { label: 'Profile', path: '/dashboard/profile' }
  ],
  admin: [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Manage Buses', path: '/admin/buses' },
    { label: 'Add Bus', path: '/admin/buses/add' },
    { label: 'Bookings', path: '/admin/bookings' },
    { label: 'Users', path: '/admin/users' }
  ]
};

export const testimonials = [
  { name: 'Sarah Ahmed', role: 'Frequent Traveler', text: 'Booking is fast, polished, and the seat selection feels premium.' },
  { name: 'Hassan Ali', role: 'Business User', text: 'The dashboard is clear, responsive, and perfectly suited for management.' },
  { name: 'Ayesha Khan', role: 'Customer', text: 'The UI feels modern and trustworthy. The payment flow is simple.' }
];

export const dummyBuses = [
  {
    _id: '664a2e1c2f4f4a1111111111',
    busName: 'Blue Horizon',
    busNumber: 'BH-101',
    route: 'Karachi to Lahore',
    departureCity: 'Karachi',
    arrivalCity: 'Lahore',
    departureTime: '08:00 AM',
    arrivalTime: '08:00 PM',
    totalSeats: 40,
    availableSeats: 28,
    busType: 'Luxury',
    price: 6500,
    amenities: ['AC', 'WiFi', 'Snacks'],
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    _id: '664a2e1c2f4f4a2222222222',
    busName: 'Royal Express',
    busNumber: 'RE-202',
    route: 'Islamabad to Karachi',
    departureCity: 'Islamabad',
    arrivalCity: 'Karachi',
    departureTime: '09:30 PM',
    arrivalTime: '01:00 PM',
    totalSeats: 36,
    availableSeats: 19,
    busType: 'Business',
    price: 7200,
    amenities: ['AC', 'Recliner', 'USB Charging'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  }
];