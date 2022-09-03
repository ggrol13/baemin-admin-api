import mongoose from "mongoose";

const bMartProduct = new mongoose.Schema({
  name: String,
  price: Number,
  imgPath: [{ path: String, imageName: String, number: Number }],
  deliveryTime: String,
  information: String,
  infoDetail: String,
  refundReturn: {
    deliveryInfo: String,
    sellerInfo: String,
    refundReturnInfo: String,
  },
  categoryId: mongoose.Types.ObjectId,
});

export const bMartProductSchema = mongoose.model(
  "bMartProduct",
  bMartProduct,
  "bMartProduct"
);
