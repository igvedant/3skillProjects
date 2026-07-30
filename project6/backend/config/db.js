import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in the .env configuration file.');
    }

    console.log(`Connecting to MongoDB using URI specified in .env...`);
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(`Proceeding... Please ensure MongoDB service is running and MONGO_URI in .env is correct.`);
  }
};

export default connectDB;
