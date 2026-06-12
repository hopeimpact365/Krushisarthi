import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI;
    
    if (!connString) {
      console.warn('⚠️  MONGODB_URI is not defined in the environment variables. Database features will be unavailable.');
      return null;
    }

    // Modern mongoose connections don't require deprecated options anymore
    const conn = await mongoose.connect(connString);
    
    console.log(`🌐 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In production, we might want to exit the process, but in dev we can log and continue
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

export default connectDB;
