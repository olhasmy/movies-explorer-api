const moviesRouter = require('express')
  .Router();

const {
  getMovies,
  postMovies,
  deleteMovies,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);

moviesRouter.post('/', postMovies);

moviesRouter.delete('/movieId', deleteMovies);

module.exports = moviesRouter;
