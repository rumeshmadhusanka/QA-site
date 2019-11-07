const server = require("net").createServer();
const io = require("socket.io")(server);

const handleClient = function (socket) {
    // we've got a client connection
    socket.emit("tweet", {user: "nodesource", text: "Hello, world!"});
};

io.on("connection", handleClient);
server.listen(3002);