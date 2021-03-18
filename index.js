const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const User = require('./user')
const Room = require('./room')

app.use('/static', express.static(__dirname + '/static'));

io.on("connection", (socket) => {
    const userIp = socket.handshake.address;
    let user = users[userIp];

    if (user.room) {
        socket.join(user.room.id);
    }

    socket.on("addMark", (pos) => {
        let user = users[userIp];

        if (!user.room) {
            return
        }

        io.to(user.room.id).emit('addMark', { pos: pos, brand: user.room.getUserShortName(user) })
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

function getUser(ip) {
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

    req.user = getUser(userIp)
    next()
})

app.get('/', (req, res) => {
    console.log(req.user)
    if (req.user.room) {
        return res.sendFile(__dirname + '/map.html')
    }
    else {
        return res.sendFile(__dirname + '/index.html')
    }

})

app.get('/rooms/:roomId', (req, res) => {
    let room = rooms[req.params.roomId];

    if (!room) {
        res.status(404).send("Room not found!")
    }

    return res.sendFile(__dirname + '/map.html')
})

app.post('/create', (req, res) => {
    if (req.user.room) {
        return;
    }

    let room = new Room(req.user);
    rooms[room.id] = room;
    req.user.room = room;

    return res.redirect('/rooms/' + room.id)
})