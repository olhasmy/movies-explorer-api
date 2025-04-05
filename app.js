require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const {
  errors,
} = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const limiter = require('./middlewares/limiter');
const mainErrCheck = require('./errors/mainErrCheck');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;
const app = express();

app.use('*', cors({
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(mainErrCheck);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
