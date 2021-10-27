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

const { PORT = 3000 } = process.env;
const app = express();

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
