/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// cached mongodb connection reference
const cachedDB = (global as any).mongoose || { conn: null, promise: null };

// connect to database or retrieve cached connection
export const connectToDb = async () => {
  if (cachedDB.conn) {
    return cachedDB.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  cachedDB.promise =
    cachedDB.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "eventify",
      bufferCommands: false,
    });

  cachedDB.conn = await cachedDB.promise;

  return cachedDB.conn;
};
