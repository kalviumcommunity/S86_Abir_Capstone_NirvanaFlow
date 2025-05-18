import mongoose from 'mongoose';

const mongoDb_Url = process.env.MongoDb_url!;

if (!mongoDb_Url) {
  throw new Error('❌ Please provide MongoDB connection string in .env.local');
}


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, 
    };

    cached.promise = mongoose.connect(mongoDb_Url, opts).then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDb;
