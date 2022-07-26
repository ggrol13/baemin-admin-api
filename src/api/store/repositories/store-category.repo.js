import { storeCategorySchema } from "../schemas/store-category.schema.js";
import { storeSchema } from "../schemas/store.schema.js";

export const saveStoreCategory = async (storeCategory) => {
  const model = new storeCategorySchema(storeCategory);
  return await model.save();
};

export const saveCategoryIdStore = async (storeid, storeCategoryId) => {
  await storeSchema.findOneAndUpdate(
    { _id: storeid },
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

export const findStoreCategoryById = async (id) => {
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

export const findStoreCategoryByName = async (name) => {
  return await storeCategorySchema.findOne({ name }).exec();
};
