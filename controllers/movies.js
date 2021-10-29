const Movie = require('../models/movie');

const ErrBadRequest = require('../errors/err-bad-request');
const ErrNotFound = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200)
      .send(movies))
    .catch(next);
};

module.exports.postMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201)
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrBadRequest(`Переданы некорректные данные при создании. ${err}`);
      }
      throw err;
    })
    .catch(next);
};

module.exports.deleteMovies = (req, res, next) => {
  const id = req.params.movieId;

  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new ErrNotFound('Указанный _id не найден.');
      }
      if (String(movie.owner) !== String(req.user._id)) {
        throw new Forbidden('Нет прав');
      }
      Movie.findByIdAndRemove(id)
        .then(() => {
          res.status(200).send({ message: 'Удалено.' });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new ErrBadRequest('Переданы некорректные данные для удаления.');
          }
          throw err;
        })
        .catch(next);
    })
    .catch(next);
};
