const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 6001;

app.use(express.static(__dirname + "/public"));

function onConnection(socket) {
    console.log("connection.")
    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
        console.log(data);
    });
}

io.on("connection", onConnection);

http.listen(port, () =>
    console.log(`listening on port http://localhost:${port}`)
);
