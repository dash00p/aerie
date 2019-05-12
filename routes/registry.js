///////////////////////////////////////////
/*            DEPRECATED                 */
///////////////////////////////////////////
const express = require('express');
const router = express.Router();
const conf = require('../conf');

/* GET users listing. */
router.get('/', (req, res, next) => {
    if(!req.isAuthenticated())
        return res.redirect('login');
    if(req.user.rank < 1)
        return res.redirect('/');
    res.render('registry', {
        title: 'Registry',
        bot_url: conf.url.bernie,
        //current_url : req.baseUrl
      });
});

module.exports = router;
