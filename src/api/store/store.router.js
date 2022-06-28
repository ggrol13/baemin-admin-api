import { createStore, getStore } from './store.controller.js';
import express from 'express';
export const storeRouter = () => {
  const router = express.Router();
  router.post('/', createStore);
  router.get('/:storeId', getStore);
  return router;
};
