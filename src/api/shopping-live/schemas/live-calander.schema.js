import mongoose from "mongoose";

const liveCalender = new mongoose.Schema({
  date: Date,
  detail: [
    {
      productId: mongoose.Types.ObjectId,
      name: String,
      info: String,
      date: Date,
    },
  ],
});

export const liveCalenderSchema = mongoose.model(
  "LiveCalender",
  liveCalender,
  "liveCalender"
);
