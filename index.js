const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)

app.use(express.static("public"))

io.on("connection", (socket) => {
    socket.on("ping", (data) => {
        io.emit("ping", data)
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

var users = []

app.get('/', (req, res) => {
    const userIp = getIp(req)

    if (users[userIp]) {
        if (users[userIp].room) {

        }
        else {
            return res.sendFile(__dirname + '/index.html')
        }
    }
    else {
        return res.sendFile(__dirname + '/index.html')
    }
})