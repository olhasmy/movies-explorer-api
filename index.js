const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const {
  errors,
} = require('celebrate');
const NotFoundError = require('./errors/not-found-error');
const {
  signup,
  signin,
} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const { PORT = 3003 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviedb',
  async (err) => {
    if (err) throw err;
    console.log('Conncted to moviedb');
  });

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

app.use(requestLogger);

app.post('/signin', signin);

app.post('/signup', signup);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', () => {
  throw new NotFoundError('Кажется что-то полшло не так! Запрашиваемая страница не найдена');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
