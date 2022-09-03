import mongoose from "mongoose";

const productSale = new mongoose.Schema({
  productId: mongoose.Types.ObjectId,
  salePercent: Number,
  startDate: Date,
  endDate: Date,
});

export const productSaleSchema = mongoose.model(
  "productSale",
  productSale,
  "productSale"
);
