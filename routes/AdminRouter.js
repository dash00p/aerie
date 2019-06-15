var express = require('express');
var router = express.Router();
const utils = require('../utils');
const controller = require('../controller/AdminController');

router.get('/', async function (req, res, next) {
    if (!req.isAuthenticated())
      return res.redirect('/login');

    if(req.user.rank < 20)
      return res.redirect('/');
  
    res.render('admin', {
      title: utils.setPagetitle(req.i18n_texts.ADMIN)
    })
  });
module.exports = router;