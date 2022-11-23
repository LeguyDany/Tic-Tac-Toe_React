// ====================================================== Notice ======================================================
// This file is about the routes of our REST API. Here is a quick overview of all the available routes:

// - GET: "http://localhost:4000/api/game" => returns the current state of the game
// - POST: "http://localhost:4000/api/game" => creates a new game session
// - POST: "http://localhost:4000/api/game/join" => allows a 2nd player to join the game
// - GET: "http://localhost:4000/api/game/:token" => checks if the game is initialized, if not does it
// - PUT: "http://localhost:4000/api/game/:token" => Updates the game's state and plays a turn
// - PUT: "http://localhost:4000/api/game/changeGrid/:token" => Updates the grid's layout for the game depending on its length


// ====================================================== Setup ======================================================
const { Router } = require('express');
const controller = require('./controller');
const functions = require('../../functions');
const router = Router();


// ====================================================== Routes ======================================================
router.get("/game", functions.checkUser, controller.getGameState);
router.post("/game", controller.addGame);
router.post("/game/join", controller.generateToken);
router.get("/game/:token", functions.checkUser ,controller.setGame);
router.put("/game/:token", functions.checkUser ,controller.updateGame);
router.put("/game/changeGrid/:token", functions.checkUser ,controller.changeGridSize);


// ====================================================== Exports ======================================================
module.exports = router;