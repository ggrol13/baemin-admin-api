import { shoppingLiveProductSchema } from "../schemas/shopping-live-product.schema.js";
import { shoppingLiveCategorySchema } from "../schemas/shopping-live-category.schema.js";

export const saveShoppingLive = async (body) => {
  const model = new shoppingLiveProductSchema(body, { strict: false });
  return await model.save();
};

export const findShoppingLiveByName = async (name) => {
  return await shoppingLiveProductSchema.findOne({ name }).exec();
};

export const findShoppingLiveById = async (id) => {
  return await shoppingLiveProductSchema.findOne({ _id: id }).exec();
};

export const saveLiveIdCategory = async (liveId, shoppingLiveCategoryId) => {
  await shoppingLiveCategorySchema.updateOne(
    { _id: shoppingLiveCategoryId },
    { $push: { shoppingId: [liveId] } }
  );
};

export const eraseShoppingLive = async (id) => {
  await shoppingLiveProductSchema.findOneAndDelete({ _id: id });
};

export const editShoppingLive = async (body, id) => {
  await shoppingLiveProductSchema.findOneAndUpdate({ _id: id }, { $set: body });
};

export const editEncoreTrue = async (id) => {
  await shoppingLiveProductSchema.findOneAndUpdate(
    { _id: id },
    { $set: { encoreYN: true } }
  );
};

export const editFunTrue = async (id) => {
  await shoppingLiveProductSchema.findOneAndUpdate(
    { _id: id },
    { $set: { funYN: true } }
  );
};

export const editDessertTrue = async (id) => {
  await shoppingLiveProductSchema.findOneAndUpdate(
    { _id: id },
    { $set: { dessertYN: true } }
  );
};

export const editDeliciousTrue = async (id) => {
  await shoppingLiveProductSchema.findOneAndUpdate(
    { _id: id },
    { $set: { deliciousYN: true } }
  );
};
