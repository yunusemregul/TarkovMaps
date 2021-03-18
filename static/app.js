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
    socket.emit("addMark", { pos: e.latlng });
});

socket.on("alreadyConnected", () => {
    $('#alreadyConnectedModal').modal({ show: true, backdrop: 'static', keyboard: false })
    $('#alreadyConnectedModal').modal('show')
})

socket.on("syncMarks", (data) => {
    console.log(data)
    for (const mark of data) {
        L.marker(mark.pos, { title: mark.name }).addTo(map);
    }
})

socket.on("addMark", (data) => {
    L.marker(data.pos, { title: data.name }).addTo(map);
});
