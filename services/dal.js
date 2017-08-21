// This should serve as Data Access Layer
const bb = require('bluebird');
const redisClient = bb.promisifyAll(require('redis'));
const config = require('../config');

const redis = redisClient.createClient(config.REDIS_URL);

function authorize(token) {
    if (!token) return Promise.reject(new Error('Missing token!'));
    return redis.hgetAsync('drivers:tokens', token).then(driverId => {
        if (!driverId) throw new Error('Driver not found!');
        return getDriver(driverId);
    }).then(driver => {
        if (!driver) throw new Error('Driver not found!');
        return driver;
    });
}

function getDrivers(ids, excludeLocation) {
    return redis.hmgetAsync('drivers', ids)
        .then(drivers => {
            if (!drivers) throw new Error('No driver found!');
            drivers = drivers.map(el => JSON.parse(el));
            if (excludeLocation) return drivers;
            return getDriversLocations(ids).then(result => {
                return drivers.map((el, idx) => {
                    if (!result[idx]) return el;
                    el.lat = result[idx].lat;
                    el.lon = result[idx].lon;
                    return el;
                });
            });
        });
}

function getDriver(id, excludeLocation) {
    return getDrivers([id], excludeLocation).then(arr => arr[0]);
}

function addDriver({ id, name, carModel, token, lat, lon }) {
    let multi = redis.multi()
        .hset('drivers', id, JSON.stringify({ id, name, carModel, isDriver: true }))
        .hset('drivers:tokens', token, id);
    if (lat && lon) {
        multi = multi.geoadd('drivers:locations', lat, lon, id);
    }
    return multi.execAsync();
}

function addClient({id, name, token}) {
    return redis.multi()
        .hset('drivers', id, JSON.stringify({ id, name, isDriver: false }))
        .hset('drivers:tokens', token, id)
        .execAsync();
}

function getNearbyDrivers({ lat, lon, distance=2, unit='km' }) {
    return redis.georadiusAsync('drivers:locations', lat, lon, distance, unit, 'withcoord')
        .then(drivers => {
            if (drivers.length) {
                drivers = drivers.map(el => ({ id: el[0], lat: el[1][0], lon: el[1][1] }));
            } else return [];
            return getDrivers(drivers.map(el => el.id), true)
                .then(d => {
                return d.map((el, idx) => {
                    el.lat = drivers[idx].lat;
                    el.lon = drivers[idx].lon;
                    return el;
                });
            })
        });
}

function getNearbyClients({ lat, lon, distance = 2, unit = 'km' }) {
    return redis.georadiusAsync('clients:locations', lat, lon, distance, unit, 'withcoord');
}

function setDriverLocation({ driverId, lat, lon }) {
    return redis.geoaddAsync('drivers:locations', lat, lon, driverId);
}

function getDriverLocation(driverId) {
    return getDriversLocations([driverId]).then(locations => locations[0]);
}

function getDriversLocations(drivers) {
    return redis.geoposAsync('drivers:locations', drivers).then(locations => {
        locations = locations.map(el => ({ lat: el[0], lon: el[1] }));
        return locations;
    });
}

function setClientLocation({ driverId, lat, lon }) {
    return redis.geoaddAsync('clients:locations', lat, lon, driverId);
}

function getClientLocation(clientId) {
    return redis.geoposAsync('clients:locations', clientId);
}

module.exports = { authorize, getDriver, addDriver, addClient, getNearbyDrivers, getNearbyClients, setDriverLocation, getDriverLocation }