const express = require('express');

const router = new express.Router();

const dal = require('../services/dal');

function auth(isDriver) {
    return (req, res, next) => {
        dal.authorize(req.query.token, isDriver).then(driver => {
            req.user = driver;
            return next();
        }).catch(err => {
            res.status(403).json({
                error: err.message
            });
        });
    };
}

// Attach api routes
// Drivers API
router.get('/drivers/:driverId', getDriver)
router.post('/drivers/:driverId/location', auth(true), setDriverLocation);
router.get('/drivers', getNearbyDrivers);

function getDriver(req, res, next) {
    let driverId = req.params.driverId;
    dal.getDriver(driverId).then(driver => {
        res.json(driver);
    }).catch(err => {
        res.status(403).json({ error: err });
    });
}

function getNearbyDrivers(req, res, next) {
    let { lat, lon, unit, distance } = req.query;
    dal.getNearbyDrivers({ lat, lon, unit, distance}).then((drivers) => {
        return res.json(drivers);
    }).catch(err => {
        res.status(404).json({ error: err.message });
    });
}

function setDriverLocation(req, res, next) {
    let driverId = req.params.driverId;
    let { lat, lon } = req.body;
    if (req.user.id != driverId) return res.status(403).json({ error: new Error('Access denied!').message });
    dal.setDriverLocation({ driverId, lat, lon }).then(() => {
        return res.json({ id: driverId, lat, lon });
    }).catch(err => {
        res.status(403).json({ error: err.message });
    });
}

module.exports = router;