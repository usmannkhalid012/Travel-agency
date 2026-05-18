require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Bus = require('../models/Bus');
const { dummyUsers, dummyBuses } = require('../utils/dummyData');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Bus.deleteMany({});
  for (const user of dummyUsers) {
    await User.create(user);
  }
  await Bus.insertMany(dummyBuses);
  console.log('Database seeded successfully');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});