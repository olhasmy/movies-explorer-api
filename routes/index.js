const router = require('express')
  .Router();
const { signinValidation, signupValidation } = require('../middlewares/validation');
const { signin, signup, signout } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', signinValidation, signin);
router.post('/signup', signupValidation, signup);
router.post('/signout', signout);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', () => {
  throw new NotFoundError('Кажется что-то полшло не так! Запрашиваемая страница не найдена');
});

module.exports = router;
