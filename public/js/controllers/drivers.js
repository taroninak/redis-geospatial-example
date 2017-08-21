function initDrivers(position) {
    var url = '/api/drivers?lat={:lat}&lon={:lon}&unit=km&distance=10'
        .replace('{:lat}', position.coords.latitude)
        .replace('{:lon}', position.coords.longitude);
    axios.get(url).then(resp => {
        console.log(resp.data);
        resp.data.forEach(el => addDriver(el));
    }).catch(err => {
        console.log(err);
    });
}

var websocket = new WebSocket('ws://localhost:3000');
websocket.addEventListener('open', function (event) {
    console.log('Connected');
});

websocket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});


