var socket = io();
var popup = L.popup();
var marks = [];

var map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 0.5,
});

map.doubleClickZoom.disable();

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

function addMark(data) {
    marks[data.id] = L.marker(data.pos, {
        icon: new L.DivIcon({
            className: 'my-div-icon',
            html: '<span class="markDot" style="background-color:' + data.color + '">' + data.title + '</span>'
        }), title: data.title
    });
    marks[data.id].on('click', function () {
        socket.emit("deleteMark", data.id)
    })
    map.addLayer(marks[data.id]);
}

function deleteMark(id) {
    map.removeLayer(marks[id])
}

socket.on("syncMarks", (data) => {
    console.log(data)
    for (const mark of data) {
        addMark(mark)
    }
})

socket.on("addMark", (data) => {
    addMark(data)
});

socket.on("deleteMark", (data) => {
    deleteMark(data)
});
