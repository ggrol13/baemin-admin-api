import express from 'express';
import bodyParser from 'body-parser';
const app = express();
import dotenv from 'dotenv';
import { connectMongo } from './middleware/mongoose.js';
import { routerV1 } from './middleware/router.main.js';
(async () => {
  dotenv.config();
  const port = process.env.PORT || 3000;
  await connectMongo().catch();

  app.use(bodyParser.json())
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
  app.use(bodyParser.urlencoded({ extended: false }))

  const options = {
    host: '0.0.0.0',
    port,
  }

  app.listen(options, () => {
    console.log('server is on port ' + port)
  })
})()
