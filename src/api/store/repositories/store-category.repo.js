import { storeCategorySchema } from "../schemas/store-category.schema.js";
import { storeSchema } from "../schemas/store.schema.js";

export const saveStoreCategory = async (storeCategory) => {
  const model = new storeCategorySchema(storeCategory);
  await model.save();
};

export const saveCategoryIdStore = async (storeId, storeCategoryId) => {
  await storeSchema.findOneAndUpdate(
    { _id: storeId },
    { storeCategoryId },
    { strict: false }
  );
};
export const saveStoreIdCategory = async (storeId, storeCategoryId) => {
  await storeCategorySchema.updateOne(
    { _id: storeCategoryId },
    { $push: { storeId: [storeId] } }
  );
};

export const aggregateStoreCategoryById = async (id) => {
  return await storeCategorySchema
    .aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "storeId",
          foreignField: "_id",
          as: "stores",
        },
      },
    ])
    .exec();
};

export const findStoreCategoryById = async (id) => {
  return await storeCategorySchema.findOne({ _id: id }).exec();
};

export const findStoreCategoryByName = async (name) => {
  return await storeCategorySchema.findOne({ name }).exec();
};

export const editStoreCategory = async (categoryBody, id) => {
  await storeCategorySchema
    .findOneAndUpdate(
      {
        _id: id,
      },
      { $set: categoryBody }
    )
    .exec();
};

export const eraseStoreCategory = async (id) => {
  await storeCategorySchema.findOneAndDelete({ _id: id });
};
