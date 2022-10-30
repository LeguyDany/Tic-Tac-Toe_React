require("dotenv").config();
const jwt = require('jsonwebtoken');

// =================================== Functions ===================================
function getTimeNow() {
    let date = new Date();
    date.setTime(date.getTime())
    return date.toUTCString()
}

function checkFinish(player1, player2, grid) {
    // Shows the possible answers for a win for any player
    // Time complexity: O(n^2 + 2n)

    let winner = "none";
    const isX = (value) => value === "X";
    const isO = (value) => value === "O";

    // Check rows
    for (let row = 0; row < grid.length; row++) {
        if (grid[row].every(isX)) {
            winner = "X";
            break;
        }
        if (grid[row].every(isO)) {
            winner = "O";
            break;
        }
    }

    // Check columns
    for (let col = 0; col < grid.length; col++) {
        let columnCheck = [];
        for (let cell = 0; cell < grid.length; cell++) {
            columnCheck.push(grid[cell][col]);
        }
        if (columnCheck.every(isX)) {
            winner = "X";
            break;
        }
        if (columnCheck.every(isO)) {
            winner = "O";
            break;
        }
    }


    // Check diagonals
    let diagonalCheck1 = [];
    let diagonalCheck2 = [];
    for (let cell = 0; cell < grid.length; cell++) {
        diagonalCheck1.push(grid[cell][cell]);
        diagonalCheck2.push(grid[grid.length - 1 - cell][cell]);
    }
    if (diagonalCheck1.every(isX)) { winner = "X"; }
    if (diagonalCheck1.every(isO)) { winner = "O"; }

    if (diagonalCheck2.every(isX)) { winner = "X"; }
    if (diagonalCheck2.every(isO)) { winner = "O"; }

    if (winner === "none") {return winner;}

    winner = winner === "X" ? player1 : player2;
    return winner;
}

// =================================== Middlewares ===================================
function checkUser(req, res, next) {
    // Checks if it's the game's host or the 2nd player who makes the API request.

    // If there isn't any header.
    if (!req.headers.authorization) return next();

    const token = req.headers.authorization.split(' ')[1];
    const decrypt_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decrypt_token.player1) {
        res.locals.player_info = {
            game_id: decrypt_token.game_id,
            player1: decrypt_token.player1,
            playerType: "host"
        }
    } else {
        res.locals.player_info = {
            game_id: decrypt_token.game_id,
            player2: decrypt_token.player2,
            playerType: "join"
        }
    }

    next();
}


module.exports = {
    getTimeNow,
    checkUser,
    checkFinish
}