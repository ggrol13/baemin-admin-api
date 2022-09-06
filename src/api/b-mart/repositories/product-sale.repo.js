import { productSaleSchema } from "../schemas/product-sale.js";

export const saveBMartSaleProduct = async (body) => {
  const model = new productSaleSchema(body);
  return model.save();
};
export const findSaleProduct = async (id) => {
  return productSaleSchema.findOne({ productId: id }).exec();
};

export const eraseBMartSaleProduct = async (id) => {
  return productSaleSchema.findOneAndDelete({ productId: id });
};

export const editBMartSaleProduct = async (body, id) => {
  return productSaleSchema.findOneAndUpdate({ productId: id }, { $set: body });
};

export const findAllBMartSaleProducts = async () => {
  return productSaleSchema.aggregate([
    {
      $lookup: {
        from: "bMartProduct",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
  ]);
};
