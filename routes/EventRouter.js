var express = require('express');
var router = express.Router();
const event = require('../controller/EventController');

router.get('/', (req, res, next) => {
    if(!req.isAuthenticated())
        return res.redirect('login');
    // if(req.user.rank < 1)
    //     return res.redirect('/');
    res.render('event', {
        title: req.i18n_texts.EVENTS,
        //bot_url: conf.url.bernie,
        });
});

router.get('/fetch', async (req, res, next) => {
    let events = await event.getUpcoming();
    res.send(events);
});

router.post('/', async (req, res, next) => {
    let newEvent = await event.create(req.body.newEvent);
    res.send(newEvent);
});

router.patch('/', async (req, res, next) => {
    let updatedEvent = await event.update(req.body.event);
    res.send(updatedEvent);
});

router.delete('/', async (req, res, next) => {
    let removedEvent = await event.remove(req.query.eventId);
    res.send({removedEvent});
})

module.exports = router;