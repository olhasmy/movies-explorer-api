const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrBadRequest = require('../errors/err-bad-request');
const ErrConflict = require('../errors/conflict');

module.exports.signup = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201)
      .send({ message: `Пользователь ${user.email} успешно зарегестрирован` }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new ErrConflict('Такой пользователь уже существует.');
      }
      throw err;
    })
    .catch(next);
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new ErrConflict('Такого пользователя не существует');
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: `Пользователь ${email} авторизован` });
    })
    .catch(() => {
      throw new ErrBadRequest('Неправильные почта или пароль');
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt')
    .send({ message: 'Вы вышли.' });
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.status(200)
        .send(user);
    })
    .catch(next);
};

module.exports.patchCurrentUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    {
      name,
      email,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200)
        .send(user);
    })
    .catch(() => {
      throw new ErrConflict('Такой пользователь уже существует.');
    })
    .catch(next);
};
