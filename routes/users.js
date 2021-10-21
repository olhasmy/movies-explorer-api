const usersRouter = require('express')
  .Router();
const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getCurrentUser,
  patchCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchCurrentUser);

module.exports = usersRouter;
