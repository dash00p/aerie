var express = require('express');
var router = express.Router();
const utils = require('../utils');
const user = require('../controller/UserController');

router.post('/new', async function (req, res, next) {
  let result = await user.create(req.body);
  if (result.success) {
    req.logIn(result.user, { session: true }, function (err) {
      if (err) { return next(err); }
      req.session.passport = JSON.stringify(req.session.passport);
      req.session.save(function (err) {
        req.session.newAccount = true;
        return res.redirect('/profile');
      });
    });
  }
  else {
    req.session.loginStatus = result;
    res.redirect('../login');
  }
});

router.get('/:username/comparePassword/:password', async function (req, res, next) {
  let username = req.params.username;
  let password = req.params.password;
  res.send(await user.comparePassword(username, password));
});

router.get('/', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/login');

  if (req.query.id) {//Fetching an other user profile
    let id = parseInt(req.query.id);
    if (!isNaN(id)) {

      let profile = await user.find(id);
      if (profile !== null) {

        return res.render('profile', {
          title: utils.setPagetitle(req.i18n_texts.PROFILE),
          profile: profile
        });
      }
    }
  }

  let message = "";
  if (req.session.newAccount) {
    message = {
      type: "success",
      text: "Compte créé avec succès !"
    }
    delete req.session.newAccount;
  }

  res.render('profile', {
    title: utils.setPagetitle(req.i18n_texts.PROFILE),
    profile: req.user,
    message: message
  })
});

router.get('/list', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.send(401, 'You must be logged in to use this ressource.'); 

  if(req.user.rank < 20)
    return res.send(401, 'You are not allowed to access this ressource.'); 

  return res.send(await user.getList());
});

router.get('/:id/rights', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.send(401, 'You must be logged in to use this ressource.'); 

  if(req.user.rank < 20)
    return res.send(401, 'You are not allowed to access this ressource.'); 

  return res.send(await user.getRights(req.params.id));
});

router.post('/:id/rights', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.send(401, 'You must be logged in to use this ressource.'); 

  if(req.user.rank < 20)
    return res.send(401, 'You are not allowed to access this ressource.'); 

  return res.send(await user.addRights(req.params.id, req.body.rightsToAdd));
});

router.delete('/:id/rights', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.send(401, 'You must be logged in to use this ressource.'); 

  if(req.user.rank < 20)
    return res.send(401, 'You are not allowed to access this ressource.'); 

  return res.send(await user.removeRights(req.params.id, req.body.rightsToRemove));
});

module.exports = router;