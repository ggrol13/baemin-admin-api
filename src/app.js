const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: false }));

const options = {
  host: '0.0.0.0',
  port,
};

app.listen(options, () => {
  console.log('server is on port ' + port);
});