var express = require('express');
var router = express.Router();
const user = require('../controller/UserController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new', async function(req, res, next) {
  let result = await user.create(req.body);
  if(result.success){
    req.logIn(result.user, { session: true }, function(err) {
      if (err) { return next(err); }
      req.session.passport = JSON.stringify(req.session.passport);
      req.session.save( function(err){
        req.session.newAccount = true;
        return res.redirect('/profile');
      }); 
    });
  }
  else{
    req.session.loginStatus = result;
    res.redirect('../login');
  }
});

router.get('/:username/comparePassword/:password', async function(req, res, next) {
  let username = req.params.username;
  let password = req.params.password;
  res.send(await user.comparePassword(username, password));
});

module.exports = router;