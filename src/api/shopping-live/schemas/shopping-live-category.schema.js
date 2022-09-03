import mongoose from "mongoose";

const shoppingLiveCategory = new mongoose.Schema({
  name: String,
  imgPath: String,
  shoppingId: [{ type: mongoose.Schema.Types.ObjectId, required: false }],
});

export const shoppingLiveCategorySchema = mongoose.model(
  "ShoppingLiveCategroy",
  shoppingLiveCategory,
  "shoppingLiveCategory"
);
