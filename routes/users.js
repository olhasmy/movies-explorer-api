const usersRouter = require('express')
  .Router();

const {
  getCurrentUser,
  patchCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);

usersRouter.patch('/me', patchCurrentUser);

module.exports = usersRouter;
