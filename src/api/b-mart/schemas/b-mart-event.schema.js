import mongoose from "mongoose";

const bMartEvent = new mongoose.Schema({
  name: String,
  productId: [mongoose.Types.ObjectId],
});

export const bMartEventSchema = mongoose.model(
  "bMartEvent",
  bMartEvent,
  "bMartEvent"
);
