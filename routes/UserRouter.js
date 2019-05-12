var express = require('express');
var router = express.Router();
const user = require('../controller/UserController');
//const passport = user.passport;
//const conf = require('../conf');
//const passport = user.passport;
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy({
//   usernameField: 'username',  
//   passwordField: 'password', 
//   passReqToCallback: true //passback entire req to call back
// },
// function(req, username, password, done) {
//   User.findOne({ username: username }.then(function(err, user) {
//     if (err) { return done(err); }
//     if (!user) {
//       return done(null, false, { message: 'Incorrect username.' });
//     }
//     if (!bcrypt.compare(password, user.password)) {
//       return done(null, false, { message: 'Incorrect password.' });
//     }
//     return done(null, user);
//   }));
// }
// ));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new', async function(req, res, next) {
  let result = await user.create(req.body);
  req.session.loginStatus = result;
  res.redirect('../login');
});

router.get('/:username/comparePassword/:password', async function(req, res, next) {
  let username = req.params.username;
  let password = req.params.password;
  res.send(await user.comparePassword(username, password));
});

// router.post('/login', async function(req, res, next) {
//   let username = req.body.username;
//   let password = req.body.password;
//   let result = await user.login(req, res);
//   res.send(result);
// });


module.exports = router;
