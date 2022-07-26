import { storeSchema } from "../schemas/store.schema.js";

export const saveStore = async (store) => {
  const model = new storeSchema(store, { strict: false });
  return await model.save();
};

export const saveMenuCategory = async (storeId, isRepresent, name) => {
  await storeSchema.updateOne(
    { _id: storeId },
    { $push: { menuCategory: { isRepresent, name } } }
  );
};

export const saveMenu = async (storeId, body, name) => {
  await storeSchema.updateOne(
    { _id: storeId },
    { $push: { "menuCategory.$[a].menu": body } },
    { arrayFilters: [{ "a.name": name }] }
  );
};

export const findStoreByName = async (name) => {
  return await storeSchema.find({ name }).exec();
};

export const findStoreById = async (storeId) => {
  return await storeSchema.findOne({ _id: storeId }).exec();
};

export const findMenuCategoryById = async (categoryId, storeId) => {
  try {
    return await storeSchema
      .findOne(
        {
          _id: storeId,
        },
        { menuCategory: { $elemMatch: { _id: categoryId } } }
      )
      .exec();
  } catch (e) {
    console.log(e);
  }
};

export const findMenuCategoryByName = async (name, id) => {
  try {
    return await storeSchema
      .findOne({ _id: id, menuCategory: { $elemMatch: { name } } }) //projection빼고 filter에 name추가
      .exec();
  } catch (e) {
    console.log(e);
  }
};
