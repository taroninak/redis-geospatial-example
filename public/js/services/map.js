var map;
var drivers = {};
var driverImage;
var myCoords;

function initMap(position) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => createMap(pos));
    } else {
        createMap({ coords: { latitude: 40.1792, longitude: 44.4991 } });
    }

    driverImage = {
        url: "https://lh6.ggpht.com/2kNvSeSXkJGXR-A9RBEq3qAMM7rdq7EQTf96fAoOf7H3EP2w4ZVmnOIN0p47AnBgAgU=w170",
        size: new google.maps.Size(71, 71),
        // origin: new google.maps.Point(0, 0),
        // anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(71, 71)
    };
}

function createMap(position) {
    myCoords = position.coords;
    var mapOptions = {
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    var marker = new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        title: 'Me'
        //icon: image
    });
    // var driver3 = { name:' Test Driver', lat: myCoords.latitude + 0.0002, lon: myCoords.longitude + 0.002, id: 'driver3' };
    // addDriver(driver3);
    // setInterval(() => {
    //     driverCoords.latitude += 0.0001;
    //     driverCoords.longitude += 0.0000001;
    //     addDriver('driver3', driverCoords);
    // }, 500);
    initDrivers(position);
}

function addDriver(driver) {
    coords = new google.maps.LatLng(driver.lat, driver.lon);
    if (driver.id in drivers) {
        var marker = drivers[driver.id].marker;
        return marker.setPosition(coords);
    } 
    var marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: driver.name,
        icon: driverImage
    });

    drivers[driver.id] = {
        marker: marker
    }
}