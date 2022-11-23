// ====================================================== Notice ======================================================
// This page is made out of the logic needed to register and update the database. It's needed for the multiplayer mode.

// This controller page will manage the "game" table in our database. Here are the columns which are going to be affected:
//  - game_id (primary key)
//  - player1 (string, host name)
//  - player2 (string, player who joins the game)
//  - turn (string, the current turn goes to which player)
//  - winner (who won the game)
//  - date (string, timestamp with time zone, date of creation of the game session)
//  - grid (current grid layout)


// ====================================================== Imports ======================================================
const axios = require('axios');
const pool = require('../../db');
const queries = require('./queries');
const functions = require('../../functions');
require("dotenv").config();
const jwt = require('jsonwebtoken');


// ====================================================== Controller ======================================================
const getGameState = (req, res) => {
    // Sends a response about the game's state about a specific game session (grid's layout, game id, players' name, winner...)
    pool.query(queries.getGameState, [res.locals.player_info.game_id], (error, result) => {
        if (error) throw error;
        res.status(200).send(result.rows[0]);
    })
}

const addGame = (req, res) => {
    // Creates a new entry in the database for the game table, while adding in the hosting player
    const { player1 } = req.body;

    const grid = functions.makeGrid(3);

    // Creates a UUID for the new entry
    pool.query(queries.addUID, (error, results) => {
        if (error) throw error;
        let uuid = results.rows[0]["uuid_generate_v4"];
        let today = functions.getTimeNow();

        // Adds a new entry with the UUID previously generated.
        pool.query(queries.addGame, [uuid, player1, grid, today, "Waiting for a 2nd player..."], (error, results) => {
            if (error) throw error;
            const gameData = {
                player1: player1,
                game_id: uuid
            }
            const token = jwt.sign(gameData, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ token: token });
        })
    })
}

const setGame = (req, res) => {
    // Initializes the game once the 2nd player entered the game.
    pool.query(queries.getGameState, [res.locals.player_info.game_id], (error, result) => {
        if (error) throw error;
        else if (!result.rows[0].player2 && res.locals.player_info.playerType == "host") { res.status(200).send("Waiting for a 2nd player...") }
        else if (!result.rows[0].player2 && res.locals.player_info.playerType == "join") {
            pool.query(queries.setPlayer2, [res.locals.player_info.game_id, res.locals.player_info.player2, result.rows[0].player1], (error, result) => {
                if (error) throw error;
                res.status(200).send("A new player has joined the game named " + res.locals.player_info.player2 + ".");
            })
        }
        else {
            res.status(200).send("ok");
        }

    })
}

const updateGame = (req, res) => {
    // Updates the game's state while doing all the logic needed to check if the player played a valid turn. It will also do the logic needed to check the winner if there is any.
    let { cell, grid } = req.body;

    pool.query(queries.getGameState, [res.locals.player_info.game_id], (error, result) => {
        if (error) throw error;
        let turn = result.rows[0].turn;
        let message;

        if (!result.rows[0].winner || result.rows[0].winner === "none") {
            if (turn == res.locals.player_info.player1 && res.locals.player_info.playerType == "host") {
                grid = result.rows[0].grid;
                if (grid[cell[0]][cell[1]] === "X" || grid[cell[0]][cell[1]] === "O") { message = "nope"; }
                else {
                    grid[cell[0]][cell[1]] = "X";
                    turn = result.rows[0].player2;
                }

            } else if (turn == res.locals.player_info.player2 && res.locals.player_info.playerType == "join") {
                grid = result.rows[0].grid;
                if (grid[cell[0]][cell[1]] === "X" || grid[cell[0]][cell[1]] === "O") { message = "nope"; }
                else {
                    grid[cell[0]][cell[1]] = "O";
                    turn = result.rows[0].player1;
                }

            } else if (turn == result.rows[0].player1 && res.locals.player_info.playerType == "join") {
                message = "Not your turn.";
            } else if (turn == result.rows[0].player2 && res.locals.player_info.playerType == "host") {
                message = "Not your turn.";
            }
            const winner = functions.checkFinish(res.locals.player_info.player1, res.locals.player_info.player2, grid);
            if (winner) { message = winner; }

            pool.query(queries.updateGame, [res.locals.player_info.game_id, turn, grid, winner], (error, results) => {
                if (error) throw error;
                res.status(200).send({ grid: grid, message: message });
            });
        } else { res.status(200).send({ grid: grid, message: result.rows[0].winner }); }

    })
}

const changeGridSize = (req, res) => {
    // Changes the grid's layout depending on the length in the request's body.
    const { gridLength } = req.body;

    pool.query(queries.getGameState, [res.locals.player_info.game_id], (error, result) => {
        if (error) throw error;

        const grid = functions.makeGrid(gridLength);
        pool.query(queries.updateGame, [result.rows[0].game_id, result.rows[0].player1, grid, "none"], (error, result) => {
            if (error) throw error;
            res.status(200).send("New grid");
        })
    })

}

const generateToken = (req, res) => {
    // Creates a 2nd player and inserts him into the game session's row
    let { player2, token } = req.body;

    const decrypt_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const playerInfo = {
        game_id: decrypt_token.game_id,
        player2: player2,
        playerType: "join"
    }

    pool.query(queries.setPlayer2, [decrypt_token.game_id, player2, decrypt_token.player1], (error, result) => {
        if (error) throw error;
        newToken = jwt.sign(playerInfo, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ token: newToken });
    })
}


// ====================================================== Exports ======================================================
module.exports = {
    addGame,
    setGame,
    getGameState,
    generateToken,
    updateGame,
    changeGridSize,
}