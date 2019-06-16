var express = require('express');
var router = express.Router();
const utils = require('../utils');
const user = require('../controller/UserController');

router.get('/rights/all', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.send(401, 'You must be logged in to use this ressource.'); 

  if(req.user.rank < 20)
    return res.send(401, 'You are not allowed to access this ressource.'); 

  return res.send(await user.getAllRights());
});

module.exports = router;