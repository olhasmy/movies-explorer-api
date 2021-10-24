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
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/moviedb',
  async (err) => {
    if (err) throw err;
    console.log('Conncted to moviedb');
  });

app.use(requestLogger);

app.use(routes);

app.use('*', () => {
  throw new NotFoundError('Кажется что-то полшло не так! Запрашиваемая страница не найдена');
});

app.use(limiter);
app.use(errorLogger);
app.use(errors());
app.use(mainErrCheck);
