import mongoose from "mongoose";

const storeCategory = new mongoose.Schema({
  name: { type: String, required: true },
  imgPath: { type: String, required: true },
  storeId: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
});

export const storeCategorySchema = mongoose.model(
  "Store_Category",
  storeCategory,
  "store_categories"
);
