import { shoppingLiveCategorySchema } from "../schemas/shopping-live-category.schema.js";
import { shoppingLiveProductSchema } from "../schemas/shopping-live-product.schema.js";

export const saveShoppingLiveCategory = async (category) => {
  const model = new shoppingLiveCategorySchema(category);
  await model.save();
};

export const findShoppingLiveCategoryByName = async (name) => {
  return await shoppingLiveCategorySchema.findOne({ name }).exec();
};

export const findShoppingLiveCategoryById = async (id) => {
  return await shoppingLiveCategorySchema.findOne({ _id: id }).exec();
};

export const eraseShoppingLiveCategory = async (id) => {
  await shoppingLiveCategorySchema.findOneAndDelete({ _id: id });
};

export const editShoppingLiveCategory = async (editCategory, id) => {
  await shoppingLiveCategorySchema
    .findOneAndUpdate(
      {
        _id: id,
      },
      { $set: editCategory }
    )
    .exec();
};

export const getAllProduct = async (id) => {
  return shoppingLiveCategorySchema.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: "shoppingLiveProduct",
        localField: "shoppingId",
        foreignField: "_id",
        as: "shoppingId",
      },
    },
  ]);
};
