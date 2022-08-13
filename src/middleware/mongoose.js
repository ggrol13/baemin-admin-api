import mongoose from "mongoose";

let isConn = false;
export const connectMongo = async () => {
  if (isConn) {
    return Promise.resolve();
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    isConn = db.connection.readyState === 1;
    console.log("mongo connect");
  } catch (e) {
    return await Promise.reject(e);
  }
};
