const usersRouter = require('express')
  .Router();
const {
  patchCurrentUserValidation,
} = require('../middlewares/validation');

const {
  getCurrentUser,
  patchCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);

usersRouter.patch('/me', patchCurrentUserValidation, patchCurrentUser);

module.exports = usersRouter;
