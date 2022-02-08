require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const {
  errors,
} = require('celebrate');
const routes = require('./routes');
const limiter = require('./middlewares/limiter');
const mainErrCheck = require('./errors/mainErrCheck');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const ALLOWED_CORS = [
  'https://movies.gonzoooo.nomoredomains.monster',
  'https://api.movies.gonzoooo.nomoredomains.monster',
  'https://localhost:3000',
];
const { PORT = 3008 } = process.env;
const app = express();

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (ALLOWED_CORS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    res.status(200).send();
  }

  next();
});

app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/moviesdb',
  async (err) => {
    if (err) throw err;
    console.log('Conncted to moviesdb');
  });

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(mainErrCheck);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
