const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
    socket.on("ping", (data) => {
        io.emit("ping", data);
    });
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});
