const dummyUsers = [
  {
    name: 'Admin User',
    email: 'admin@busticket.com',
    password: 'Admin@12345',
    phone: '03000000000',
    role: 'admin'
  },
  {
    name: 'Ayesha Khan',
    email: 'customer@busticket.com',
    password: 'Customer@12345',
    phone: '03111111111',
    role: 'customer'
  }
];

const dummyBuses = [
  {
    busName: 'Blue Horizon',
    busNumber: 'BH-101',
    driverName: 'Imran Ali',
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
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    busName: 'Royal Express',
    busNumber: 'RE-202',
    driverName: 'Saeed Ahmed',
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
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  }
];

module.exports = { dummyUsers, dummyBuses };