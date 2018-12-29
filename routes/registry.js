const express = require('express');
const router = express.Router();
const conf = require('../conf');

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('registry', {
        title: 'Registry',
        bot_url: conf.url.bernie,
        current_url : req.originalUrl
      });
});

module.exports = router;
