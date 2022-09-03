import mongoose from "mongoose";

const bMartProductCategory = new mongoose.Schema({
  name: String,
  imgPath: String,
  productId: [mongoose.Types.ObjectId],
});

export const bMartCategorySchema = mongoose.model(
  "bMartProductCategory",
  bMartProductCategory,
  "bMartProductCategory"
);
