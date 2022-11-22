const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const gameRoutes = require("./api_rest/src/game/routes");

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get("/", (req, res) => { res.status(200).send("Welcome to the api for this tic tac toe!"); });
app.use("/api/", gameRoutes);


http.listen(port, () => {
    console.log(`Server listening on ${port}`);
});


socketIO.on('connection', (socket) => {

    socket.on('playerTurn', (data) => {
        socketIO.emit('updateGrid'+data.token, "Update of the grid needed");
    })

    socket.on('disconnect', () => {
        
    });
});