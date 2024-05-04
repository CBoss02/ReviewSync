const socketIo = require('socket.io');
let io = null;

function init(httpServer) {
    io = socketIo(httpServer);
    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

module.exports = {
    init,
    getIO
};