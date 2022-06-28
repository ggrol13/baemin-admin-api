import { storeRouter } from '../api/store/store.router.js';

export const routerV1 = (app) => {
  app.use('/api/v1/store', storeRouter());
};
