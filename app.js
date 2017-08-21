const express = require('express');
const bodyParser = require('body-parser');
const server = require('http').createServer();
const WebSocketServer = require('uws').Server;
const wss = new WebSocketServer({ server: server });
const app = express();

const config = require('./config');
const apiController = require('./controllers/api');
const webSocketController = require('./controllers/websocket');

// Attach express middlwares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Attach api
app.use('/api', apiController);

// Attach websocket controller
wss.on('connection', (ws) => {
    let upgradeReq = ws.upgradeReq;
    process.nextTick(() => {
        webSocketController.connect(ws, upgradeReq);
    });
});

// Handle server errors
server.on('error', (err) => {
    console.error(err);
});

// Redirect http requests to express
server.on('request', app);

// Start and listen server
server.listen(config.SERVER_PORT, config.SERVER_IP, () => {
    console.log(`Started server at ${config.SERVER_IP}:${config.SERVER_PORT}`);
});