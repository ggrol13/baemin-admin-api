import { liveCalenderSchema } from "../schemas/live-calander.schema.js";

export const saveLiveCalender = async (body) => {
  const model = new liveCalenderSchema(body, { strict: false });
  return await model.save();
};

export const findLiveCalender = async (date) => {
  return liveCalenderSchema.findOne({ date });
};

export const findLiveCalenderByProductId = async (id) => {
  return liveCalenderSchema.findOne({
    detail: { $elemMatch: { productId: id } },
  });
};

export const eraseProductFromLiveCalender = async (date, id) => {
  return liveCalenderSchema.findOneAndUpdate(
    { date },
    { $pull: { detail: { productId: id } } }
  );
};

export const findLiveCalenderAll = async () => {
  return liveCalenderSchema.find({});
};

export const putLiveCalender = async (id, body) => {
  return liveCalenderSchema.findOneAndUpdate({ _id: id }, { $push: body });
};

export const editDate = async (body) => {
  return liveCalenderSchema.findOneAndUpdate({}, { $set: { detail: body } });
};
