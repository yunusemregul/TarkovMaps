var socket = io();
var popup = L.popup();

var map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 0.5,
});

var bounds = [
    [0, 0],
    [6843, 9530],
];

var image = L.imageOverlay("/static/img/woods.png", bounds).addTo(map);

map.fitBounds(bounds);

map.on("click", function (e) {
    socket.emit("ping", e.latlng);
});

socket.on("ping", (data) => {
    L.marker(data, {title: 'hello'}).addTo(map);
});
