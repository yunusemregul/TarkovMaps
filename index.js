const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
module.exports = io
const User = require('./user')
const Room = require('./room')

app.use('/static', express.static(__dirname + '/static'));

io.on("connection", (socket) => {
    const userIp = socket.handshake.address;
    let user = users[userIp];

    if (!user) {
        return
    }

    if (user.connected) {
        socket.emit('alreadyConnected', undefined, () => {
            socket.disconnect(true)
        })
        return;
    }

    if (user.room) {
        console.log('user ' + user.ip + ' connected')
        user.connected = true;
        user.socketId = socket.id;
        socket.join(user.room.id);
        user.room.syncMarks(user);

        socket.on("addMark", (data) => {
            let user = users[userIp];

            if (!user.room) {
                return
            }

            user.addMark(data);
        })

        socket.on('deleteMark', (id) => {
            user.deleteMark(id);
        })
    }

    socket.on('disconnect', () => {
        console.log('user ' + user.ip + ' disconnected')
        socket.removeAllListeners();
        user.connected = false;
    })
})

http.listen(3000, () => {
    console.log("listening on *:3000")
})

function getIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null)
}

/** @type {User[]} */
var users = []
/** @type {Room[]} */
var rooms = []

function addAndGetUser(ip) {
    if (!users[ip]) {
        users[ip] = new User(ip)
    }
    else {
        users[ip].updateLastActive()
    }

    return users[ip]
}

app.use(function (req, res, next) {
    const userIp = getIp(req)

    req.user = addAndGetUser(userIp)
    next()
})

app.get('/', (req, res) => {
    if (req.user.room) {
        req.user.leaveRoom()
    }

    return res.sendFile(__dirname + '/index.html')
})

app.get('/rooms/:roomId', (req, res) => {
    let room = rooms[req.params.roomId];

    if (!room) {
        return res.status(404).send("Room not found!")
    }

    if (req.user.room && req.user.room != room) {
        return res.status(500).send("You can not join to this room! You are already joined to some other.")
    }

    if (!req.user.room) {
        req.user.joinRoom(room);
    }

    return res.sendFile(__dirname + '/map.html')
})

app.post('/create', (req, res) => {
    if (req.user.connected) {
        return res.status(500).send("You are already connected to some room!")
    }

    let room = new Room(req.user);
    rooms[room.id] = room;
    req.user.joinRoom(room);

    return res.redirect('/rooms/' + room.id)
})