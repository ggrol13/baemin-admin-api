import { validateQuery } from '../../common/validate.js';

export const createStore = (req, res) => {
  console.log(req.body);
  res.send('response');
};

export const getStore = (req, res) => {
  console.log(req.body);
  res.send('get');
};
