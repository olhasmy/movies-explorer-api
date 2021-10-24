const moviesRouter = require('express')
  .Router();

const {
  getMovies,
  postMovies,
  deleteMovies,
} = require('../controllers/movies');

const {
  postMoviesValidation,
  deleteMovieValidation,
} = require('../middlewares/validation');

moviesRouter.get('/', getMovies);

moviesRouter.post('/', postMoviesValidation, postMovies);

moviesRouter.delete('/:movieId', deleteMovieValidation, deleteMovies);

module.exports = moviesRouter;
