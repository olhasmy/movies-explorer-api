const moviesRouter = require('express')
  .Router();
const validator = require('validator');
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getMovies,
  postMovies,
  deleteMovies,
} = require('../controllers/movies');

const method = (value) => {
  const result = validator.isURL(value, { require_protocol: true });
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

moviesRouter.get('/', getMovies);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(method),
    trailer: Joi.string().required().custom(method),
    thumbnail: Joi.string().required().custom(method),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovies);

moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovies);

module.exports = moviesRouter;
