var express = require('express');
var router = express.Router();
const user = require('../controller/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new', async function(req, res, next) {
  res.send(await user.sync());
});

module.exports = router;
