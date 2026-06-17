import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI;
    
    if (!connString) {
      console.warn('⚠️  MONGODB_URI is not defined in the environment variables. Database features will be unavailable.');
      return null;
    }

    // Configure connection pooling to optimize database operations under load
    const conn = await mongoose.connect(connString, {
      maxPoolSize: 100,
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });
    
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
