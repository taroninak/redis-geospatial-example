const faker = require('faker');
const uuid = require('uuid');

const dal = require('./dal');

function generate({ lat, lon, count = 10, radius = 10 }) {
    let latDistance = radius * 0.01;
    let lonDistance = radius * Math.cos(lat) / 111;
    for (let idx = 0; idx < count; idx++) {
        dal.addDriver({
            id: uuid(),
            name: faker.name.findName(),
            carModel: faker.lorem.word(),
            token: uuid(),
            lat: uniform(lat - latDistance,lat + latDistance),
            lon: uniform(lon - lonDistance, lon + lonDistance)
        });
    }
}

function uniform(a, b) {
    if (!b) {
        return Math.random() * a;
    }
    return a + uniform(b - a);
}

module.exports.generate = generate;