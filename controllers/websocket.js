const URL = require('url');
const uuid = require('uuid');

const dal = require('../services/dal');

const connections = new Set();


function connect(ws, upgradeReq) {
    let url = URL.parse(upgradeReq.url, true);
    connections.add(ws);
    let promise;
    if (/drivers/.test(url.pathname) && url.query.token) {
        promise = dal.authorize(url.query.token)
    } else {
        promise = Promise.resolve({ id: uuid(), isDriver: false });
    }

    promise.then(user => {
        ws.on('message', (message) => { onMessage(ws, message) });
        ws.on('close', () => { onClose(ws) });
        ws.on('error', (err) => { onError(err) });
        ws.isDriver = Boolean(user.isDriver);
        ws.id = user.id;
        connections.add(ws);

        ws.send(JSON.stringify({ type: 'connection', status:'connected', id: ws.id }));
    }).catch(err => {
        ws.close();
    });
}

function onError() {

}

function onClose(ws) {
    connections.delete(ws);
}

function onMessage(ws, message) {
    
}

function sendToClients(message) {
    let clients = Array.from(connections).filter(el => !el.isDriver);
    clients.forEach(el => el.send(message));
}

module.exports = {
    connect, sendToClients
}