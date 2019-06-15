const express = require('express');
const router = express.Router();
const conf = require('../conf');
const utils = require('../utils');
const passport = require('../controller/PassportController');
const user = require('../controller/UserController');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Aerie',
    message: ''
  });
});

router.get('/login', function(req, res, next) {
  message = "";
  if(req.session && req.session.loginStatus){
    message = req.session.loginStatus.message;
    delete req.session.loginStatus;
  }

  if(req.isAuthenticated())
    return res.redirect('registry');
  res.render('login', {
    title: utils.setPagetitle(req.i18n_texts.CONNECTION),
    message: message
  });
});

router.get('/registry', (req, res, next) => {
  if(!req.isAuthenticated())
      return res.redirect('login');
  if(req.user.rank < 2)
      return res.redirect('/');
  res.render('registry', {
      title: utils.setPagetitle(req.i18n_texts.REGISTRY_ANEKSI),
      bot_url: conf.url.bernie,
    });
});

router.get('/logout', function(req, res, next) {
  if(req.isAuthenticated()){
    req.session.destroy();
    return res.redirect('/');
  }
});

router.get('/mouvelian-calendar', function(req, res, next) {
  res.render('mouvelian_calendar', {
    title: utils.setPagetitle(req.i18n_texts.MOUVELIAN_CALENDAR)
  });
});

router.get('/brawl', (req, res, next) =>{
  res.render('brawl', {
    title: utils.setPagetitle(req.i18n_texts.SQUARE_BRAWL)
  });
});

/* API CALLS*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, message) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
  
    if (err) {
        return next(err);
    }
  
    if (!user) {
      if(!message.text)
        message = { text: message.message, type:'danger'};
      return res.render('login', {
        title: 'Connexion',
        message: message
      });
    }
  
    req.logIn(user, { session: true }, function(err) {
      if (err) { return next(err); }
      req.session.passport = JSON.stringify(req.session.passport);
      req.session.save( function(err){
        res.redirect('/registry');
      }); 
    });
  })(req, res, next);
});

router.post('/timeout', function(req, res, next) {
  setTimeout(function(){
    res.send("ok");
  }, req.body.delay);
});

module.exports = router;