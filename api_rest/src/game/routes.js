const { Router } = require('express');
const controller = require('./controller');
const functions = require('../../functions');

const router = Router();

router.get("/game", functions.checkUser, controller.getGameState);
router.post("/game", controller.addGame);
router.post("/game/join", controller.generateToken);
router.get("/game/:token", functions.checkUser ,controller.setGame);
router.put("/game/:token", functions.checkUser ,controller.updateGame);
router.put("/game/changeGrid/:token", functions.checkUser ,controller.changeGridSize);

module.exports = router;