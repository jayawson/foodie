const User = require('../schemas/UserSchema');

module.exports = function (app, server) {
    const io = require("socket.io")(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    app.set('io', io);

    io.on("connection", socket => {
        socket.on("userConnect", (id) => {
            User
                .findById(id)
                .then((user) => {
                    if (user) {
                        socket.join(user._id.toString());
                        console.log('Client connected.');
                    }
                })
                .catch((e) => {
                    console.log('Invalid user ID, cannot join Socket.');
                });
        });

        socket.on("userDisconnect", (userID) => {
            socket.leave(userID);
            console.log('Client Disconnected.');
        });

        socket.on("onFollowUser", (data) => {
            console.log(data);
        });

        socket.on("disconnect", () => {
            console.log('Client disconnected');
        });
    });
}