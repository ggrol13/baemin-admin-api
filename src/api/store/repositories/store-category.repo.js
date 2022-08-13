import { storeCategorySchema } from "../schemas/store-category.schema.js";
import { storeSchema } from "../schemas/store.schema.js";

export const saveStoreCategory = async (storeCategory) => {
  const model = new storeCategorySchema(storeCategory);
  await model.save();
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

export const findStoreCategoryById = async (storeId) => {
  return await storeCategorySchema.findOne({ _id: storeId }).exec();
};

export const findStoreCategoryByName = async (name) => {
  return await storeCategorySchema.findOne({ name }).exec();
};

export const editStoreCategory = async (name, file, id) => {
  if (!file) {
    await storeCategorySchema.findOneAndUpdate({ _id: id }, { $set: { name } });
  } else if (!name) {
    const path = file.path;
    await storeCategorySchema.findOneAndUpdate(
      { _id: id },
      { $set: { imgPath: path } }
    );
  } else {
    const path = file.path;
    await storeCategorySchema.findOneAndUpdate(
      { _id: id },
      { $set: { name, imgPath: path } }
    );
  }
};

export const eraseStoreCategory = async (id) => {
  await storeCategorySchema.findOneAndDelete({ _id: id });
};
