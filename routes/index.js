const router = require('express')
  .Router();
const { signinValidation, signupValidation } = require('../middlewares/validation');
const { signin, signup, signout } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');

router.post('/signin', signinValidation, signin);

router.post('/signup', signupValidation, signup);

router.post('/signout', signout);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
