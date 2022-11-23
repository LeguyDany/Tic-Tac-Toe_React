// ====================================================== Notice ======================================================
// This page creates a back-end server which will be used for the multiplayer feature.


// ====================================================== Import / Setup ======================================================
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


// ================================================= Connection to the server =================================================

// Setting up the CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Route to the page which shows that the server is connected.
app.get("/", (req, res) => { res.status(200).send("Welcome to the api for this tic tac toe!"); });

// Router
app.use("/api/", gameRoutes);

// Creates a back-end server on the port 4000
http.listen(port, () => {
    console.log(`Server listening on ${port}`);
});


// ----------------------------------- Web socket -----------------------------------

// On connection of the players
socketIO.on('connection', (socket) => {

    // If the front-end emits a 'playerTurn', sends a notification to tell the front-end of both players to update their grid layout with the newly updated grid layout from the database.
    socket.on('playerTurn', (data) => {
        socketIO.emit('updateGrid'+data.token, "Update of the grid needed");
    })

    // When a player disconnects
    socket.on('disconnect', () => {
        
    });
});