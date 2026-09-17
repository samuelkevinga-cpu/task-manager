const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    throw new Error(
      'MONGODB_URI is missing or still a placeholder. Copy .env.example to .env and set your Atlas URI.'
    );
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
};

module.exports = connectDB;
