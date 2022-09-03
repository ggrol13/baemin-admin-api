import { bMartProductSchema } from "../schemas/product.schema.js";

export const saveBMartProduct = async (body) => {
  const model = new bMartProductSchema(body);
  return await model.save();
};

export const findBMartProductByName = async (name) => {
  return bMartProductSchema.findOne({ name }).exec();
};

export const findProductById = async (id) => {
  return bMartProductSchema.findOne({ _id: id }).exec();
};

export const eraseBMartProduct = async (id) => {
  return bMartProductSchema.findOneAndDelete({ _id: id }).exec();
};

export const editBMartProduct = async (body, id) => {
  await bMartProductSchema.findOneAndUpdate({ _id: id }, { $set: body });
};
