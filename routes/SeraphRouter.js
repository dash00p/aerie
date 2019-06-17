var express = require('express');
var router = express.Router();
const utils = require('../utils');
const controller = require('../controller/SeraphController');
const moment = require('moment');

router.get('/', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.redirect('/login');

    if (req.user.rank < 20)
        return res.redirect('/');

    res.render('seraph', {
        title: utils.setPagetitle(req.i18n_texts.SERAPH_QUARTER)
    });
});

router.get('/investigation', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.redirect('/login');

    if (req.user.rank < 20)
        return res.redirect('/');

    let id = parseInt(req.query.id);
    if (!isNaN(id)) {

        let investigation = await controller.getInvestigation(id);
        if (investigation !== null) {
            investigation.start = moment(investigation.start).format('DD/MM/YYYY');
            return res.render('investigation', {
                title: utils.setPagetitle(req.i18n_texts.INVESTIGATION),
                investigation: investigation
            });
        }
    }
    else
        return res.send(400);
});

//API
router.get('/investigation/all', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.redirect('/login');

    if (req.user.rank < 20)
        return res.redirect('/');

    let investigations = await controller.getAllInvestigations();
    return res.send(investigations);
});

router.get('/investigation/:id/records', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.redirect('/login');

    if (req.user.rank < 20)
        return res.redirect('/');

    let id = parseInt(req.params.id);
    if (!isNaN(id)) {
        let records = await controller.getRecords(id);
        if(records === null)
            return res.send(204);

        return res.send(records);
    }
    return res(400);
});

router.post('/investigation', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.send(401, 'You must be logged in to use this ressource.');

    if (req.user.rank < 20)
        return res.send(401, 'You are not allowed to access this ressource.');

    let investigation = await controller.createInvestigation(req.body.newInvestigation);
    res.send(investigation);
});

router.patch('/investigation', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.send(401, 'You must be logged in to use this ressource.');

    if (req.user.rank < 20)
        return res.send(401, 'You are not allowed to access this ressource.');

    await controller.updateInvestigation(req.body.investigationId, req.body.properties);
    res.send(204);
});

router.post('/testimonial', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.send(401, 'You must be logged in to use this ressource.');

    if (req.user.rank < 20)
        return res.send(401, 'You are not allowed to access this ressource.');

    let testimonial = await controller.createTestimonial(req.body.newTestimonial);
    res.send(testimonial);
});

router.post('/proof', async function (req, res, next) {
    if (!req.isAuthenticated())
        return res.send(401, 'You must be logged in to use this ressource.');

    if (req.user.rank < 20)
        return res.send(401, 'You are not allowed to access this ressource.');

    let proof = await controller.createProof(req.body.newProof);
    res.send(proof);
});

module.exports = router;