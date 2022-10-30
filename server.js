const express = require("express");

const app = express();
const port = 4000;

const gameRoutes = require("./api_rest/src/game/routes");

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get("/", (req, res) => {res.status(200).send("Welcome to the api for this tic tac toe!");});
app.use("/api/", gameRoutes);

app.listen(port, () => {console.log(`Listening on port ${port}...`)});