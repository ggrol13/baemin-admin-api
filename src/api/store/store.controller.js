import { validateQuery } from '../../common/validate.js';

export const createStore = (req, res) => {
  console.log(req.body);
  res.send('response');
};

export const getStore = (req, res) => {
  const validateKey = {
    store: { nullable: false },
    storeId: { nullable: false },
  };
  if (!validateQuery(req.query, validateKey, res)) {
    return;
  }
  res.send('get');
};
