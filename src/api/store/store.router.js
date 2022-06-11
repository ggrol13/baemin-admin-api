import { createStore, getStore } from './store.controller.js';
import express from 'express';
const router = express.Router();
export const storeRouter = () => {
  router.post('/', createStore);
  router.get('/', getStore);
  return router;
};
